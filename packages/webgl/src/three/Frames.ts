import { Clock, type WebGLRenderer } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import BatchFunction from '../utils/BatchFunction';
import now from '../utils/now';

const execute = (fn?: () => void) => fn && fn();

class Frames extends BatchFunction<[{ time: number; deltaTime: number }]> {
	#rafID: undefined | number = undefined;
	#paused = true;
	#clock = new Clock();
	#stats = new Stats();
	// #renderer: WebGLRenderer | undefined;
	debug = false;

	constructor() {
		super();
		this.#clock.autoStart = false;
		this.#clock.stop();
	}

	get paused() {
		return this.#paused;
	}

	private tick = (time: number) => {
		if (this.debug && !document.body.contains(this.#stats.dom))
			document.body.appendChild(this.#stats.dom);
		if (!this.debug && document.body.contains(this.#stats.dom))
			document.body.removeChild(this.#stats?.dom);
		if (this.debug) this.#stats.update();

		const deltaTime = this.#clock.getDelta() * 1000;
		super.run({ time, deltaTime });
		if (typeof this.#rafID === 'number') this.#rafID = requestAnimationFrame(this.tick);
	};

	// attachRenderer = (renderer: WebGLRenderer) => {
	// 	this.#renderer = renderer;
	// };

	play = (renderer?: WebGLRenderer) => {
		if (!this.#paused) return;
		this.#paused = false;
		this.#clock.start();
		if (renderer) renderer.setAnimationLoop(this.tick);
		else this.#rafID = requestAnimationFrame(this.tick);
	};

	pause = (renderer?: WebGLRenderer) => {
		this.#paused = true;
		this.#clock.stop();
		if (renderer) renderer.setAnimationLoop(null);
		if (typeof this.#rafID === 'number') cancelAnimationFrame(this.#rafID);
	};

	// add(
	// 	...callbacks: ((
	// 		...args: [{ time: number; deltaTime: number;}]
	// 	) => void)[]
	// ) {
	// 	super.add(...callbacks);
	// 	if (this.size > 0) this.play();
	// }
	// remove(
	// 	...callbacks: ((
	// 		...args: [{ time: number; deltaTime: number; }]
	// 	) => void)[]
	// ) {
	// 	super.remove(...callbacks);
	// 	if (this.size === 0) this.pause();
	// }

	interpolate = ({
		from = 0,
		to = 1,
		onStart,
		onUpdate,
	}: // onComplete
	{
		from: number;
		to: number;
		onStart?: InterpolateCallback;
		onUpdate?: InterpolateCallback;
		// onComplete?: InterpolateCallback
	}) => {
		return new Promise<number>((res) => {
			let value = from;
			const sign = from < to ? 1 : -1;

			const tick = (o: { time: number; deltaTime: number }) => {
				const deltaTime = o.deltaTime * sign;
				value += deltaTime;

				if ((sign > 0 && value > to) || (sign < 0 && value < to)) {
					this.remove(tick);
					res(value);
					return;
				} else if (typeof onUpdate === 'function') onUpdate({ value, ...o });
			};

			if (typeof onStart === 'function') onStart({ value, time: 0, deltaTime: 0.08 });
			this.add(tick);
		});
	};

	wait = (delay = 0) => new Promise((res) => setTimeout(res, delay));

	animation = ({
		steps = 0,
		duration = 400,
		delay = 0,
		iterations = 0,
		onStart,
		onUpdate,
		onComplete,
	}: {
		steps?: number;
		duration?: number;
		delay?: number;
		iterations?: number;
		onStart?: () => void;
		onUpdate?: () => void;
		onComplete?: () => void;
	}) => {
		let id: ReturnType<typeof setTimeout> | undefined;
		let startTime = 0;
		let currentStep = 0;
		let currentIteration = 0;

		const tick = ({ time }: { time: number; deltaTime: number }) => {
			const elapsed = time - startTime;
			if (steps > 0) {
				const step = Math.min(Math.floor((elapsed / duration) * steps), steps - 1);
				if (step !== currentStep) {
					currentStep = step;
					execute(onUpdate);
				}
			} else execute(onUpdate);

			if (elapsed >= duration) {
				this.remove(tick);
				execute(onComplete);

				currentIteration++;
				if (iterations < 0 || iterations === Infinity || currentIteration < iterations) {
					if (typeof id === 'number') clearTimeout(id);
					if (delay > 0)
						id = setTimeout(() => {
							startTime = now();
							execute(onStart);
							this.add(tick);
						}, delay);
					else start();
				}
			}
		};

		const start = () => {
			startTime = now();
			execute(onStart);
			this.add(tick);
		};

		if (typeof id === 'number') clearTimeout(id);
		if (delay > 0) id = setTimeout(start, delay);
		else start();

		return () => this.remove(tick);
	};
}

type InterpolateCallback = (it: { value: number; time: number; deltaTime: number }) => void;

export default Frames;
