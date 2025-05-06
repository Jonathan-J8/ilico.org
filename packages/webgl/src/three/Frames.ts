import { Clock, type WebGLRenderer } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import BatchFunction from '../utils/BatchFunction';

class Frames extends BatchFunction<
	[{ time: number; deltaTime: number; renderer: WebGLRenderer | undefined }]
> {
	#paused = false;
	#clock = new Clock();
	#stats = new Stats();
	#renderer: WebGLRenderer | undefined;
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
		super.run({ time, deltaTime, renderer: this.#renderer });
	};

	attachRenderer = (renderer: WebGLRenderer) => {
		this.#renderer = renderer;
	};

	play = () => {
		if (!this.#renderer) throw new Error('Frames could not start: : No WebGLRenderer attached');
		this.#paused = false;
		this.#clock.start();
		this.#renderer.setAnimationLoop(this.tick);
	};

	pause = () => {
		if (!this.#renderer) throw new Error('Frames could not pause: : No WebGLRenderer attached');
		this.#paused = true;
		this.#clock.stop();
		this.#renderer.setAnimationLoop(null);
	};

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
}

type InterpolateCallback = (it: { value: number; time: number; deltaTime: number }) => void;

export default Frames;
