import BatchFunction from './BatchFunction';
import now from './now';
import wait from './wait';

const execute = (fn?: () => void) => fn && fn();

type InterpolateCallback = (it: { value: number; time: number; deltaTime: number }) => void;

class Frames extends BatchFunction<[{ time: number; deltaTime: number }]> {
	#rafID: undefined | number = undefined;
	#paused = true;
	#previousTime = 0;
	#deltaTime = 0.16;

	debug = false;

	constructor() {
		super();
	}

	get paused() {
		return this.#paused;
	}

	private tick = (time: number) => {
		this.#deltaTime = Math.abs(time - this.#previousTime);
		this.#previousTime = time;
		super.run({ time, deltaTime: this.#deltaTime });
		this.#rafID = requestAnimationFrame(this.tick);
	};

	play = () => {
		if (!this.#paused) return;
		this.#paused = false;
		this.#previousTime = now();
		this.#rafID = requestAnimationFrame(this.tick);
	};

	pause = () => {
		this.#paused = true;
		if (typeof this.#rafID === 'number') cancelAnimationFrame(this.#rafID);
	};
	wait = wait;

	interpolate = ({
		from = 0,
		to = 1,
		onStart,
		onUpdate,
		onComplete,
	}: {
		from: number;
		to: number;
		onStart?: InterpolateCallback;
		onUpdate?: InterpolateCallback;
		onComplete?: InterpolateCallback;
	}) => {
		let value = from;
		const sign = from < to ? 1 : -1;

		const tick = (o: { time: number; deltaTime: number }) => {
			const deltaTime = o.deltaTime * sign;
			value += deltaTime;

			if (typeof onUpdate === 'function') onUpdate({ value, ...o });

			if ((sign > 0 && value > to) || (sign < 0 && value < to)) {
				if (typeof onComplete === 'function') onComplete({ value, ...o });
				this.remove(tick);
			}
		};

		if (typeof onStart === 'function') onStart({ value, time: 0, deltaTime: 0.08 });
		this.add(tick);
	};

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

		const tick = ({ time }: { time: number }) => {
			const elapsed = Math.abs(time - startTime);
			if (steps > 0) {
				const step = Math.min(Math.floor((elapsed / duration) * steps), steps - 1);

				if (step !== currentStep) {
					currentStep = step;
					execute(onUpdate);
				}
			} else execute(onUpdate);

			if (elapsed >= duration) {
				this.remove(tick);
				execute(onUpdate);
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

export default Frames;
