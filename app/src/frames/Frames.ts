import BatchFunction from '../utils/BatchFunction';

const now = () => (performance || new Date()).now();
const execute = (fn?: () => void) => fn && fn();
class Frames extends BatchFunction<[{ time: number; deltaTime: number }]> {
	#paused = false;
	#id: number | undefined;
	#previousTime = 0;
	constructor() {
		super();
	}

	get paused() {
		return this.#paused;
	}

	private tick = (time: number) => {
		const deltaTime = time - this.#previousTime;
		this.#previousTime = time;

		super.run({ time, deltaTime });
		this.#id = requestAnimationFrame(this.tick);
	};

	private play = () => {
		this.#paused = false;
		this.#previousTime = now();
		this.#id = requestAnimationFrame(this.tick);
	};

	private pause = () => {
		this.#paused = true;
		if (typeof this.#id === 'number') cancelAnimationFrame(this.#id);
	};

	add(...callbacks: ((...args: [{ time: number; deltaTime: number }]) => void)[]) {
		super.add(...callbacks);
		if (this.size > 0) this.play();
	}
	remove(...callbacks: ((...args: [{ time: number; deltaTime: number }]) => void)[]) {
		super.remove(...callbacks);
		if (this.size === 0) this.pause();
	}

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
		onStart?: InterpolateCallback;
		onUpdate?: InterpolateCallback;
		onComplete?: InterpolateCallback;
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
	transition = ({
		steps = 0,
		duration = 400,
		delay = 0,
		onStart,
		onUpdate,
		onComplete,
	}: {
		steps?: number;
		duration?: number;
		delay?: number;
		onStart?: InterpolateCallback;
		onUpdate?: InterpolateCallback;
		onComplete?: InterpolateCallback;
	}) => {
		let id: ReturnType<typeof setTimeout> | undefined;
		let startTime = 0;
		let currentStep = 0;

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

type InterpolateCallback = () => void;

export default Frames;
