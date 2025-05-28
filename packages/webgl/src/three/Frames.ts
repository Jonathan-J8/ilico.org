import { Frames as BaseFrames } from 'pkg-utils';
import { Clock, type WebGLRenderer } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';

// const execute = (fn?: () => void) => fn && fn();

// type InterpolateCallback = (it: { value: number; time: number; deltaTime: number }) => void;

class Frames extends BaseFrames {
	#rafID: undefined | number = undefined;
	#paused = true;
	#clock = new Clock();
	#stats = new Stats();
	debug = false;

	constructor() {
		super();
		this.#clock.autoStart = false;
		this.#clock.stop();
	}

	get paused() {
		return this.#paused;
	}

	_tick = (time: number) => {
		if (this.debug && !document.body.contains(this.#stats.dom))
			document.body.appendChild(this.#stats.dom);
		if (!this.debug && document.body.contains(this.#stats.dom))
			document.body.removeChild(this.#stats?.dom);
		if (this.debug) this.#stats.update();

		const deltaTime = this.#clock.getDelta() * 1000;
		this.run({ time, deltaTime });
		if (typeof this.#rafID === 'number') this.#rafID = requestAnimationFrame(this._tick);
	};

	play = (renderer?: WebGLRenderer) => {
		if (!this.#paused) return;
		this.#paused = false;
		this.#clock.start();
		if (renderer) renderer.setAnimationLoop(this._tick);
		else this.#rafID = requestAnimationFrame(this._tick);
	};

	pause = (renderer?: WebGLRenderer) => {
		this.#paused = true;
		this.#clock.stop();
		if (renderer) renderer.setAnimationLoop(null);
		if (typeof this.#rafID === 'number') cancelAnimationFrame(this.#rafID);
	};
}

export default Frames;
