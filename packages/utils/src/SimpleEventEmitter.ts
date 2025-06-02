/**
 * simple mono event emitter
 */

class SimpleEventEmitter<T extends any[]> {
	#batch: Set<(...args: T) => void>;

	constructor() {
		this.#batch = new Set<(...args: T) => void>();
	}

	get size() {
		return this.#batch.size;
	}

	on(...callbacks: ((...args: T) => void)[]) {
		for (let i = 0, len = callbacks.length; i < len; i++) {
			this.#batch.add(callbacks[i]);
		}
	}

	off(...callbacks: ((...args: T) => void)[]) {
		for (let i = 0, len = callbacks.length; i < len; i++) {
			this.#batch.delete(callbacks[i]);
		}
	}

	fire(...args: T) {
		this.#batch.forEach((callback) => {
			callback(...args);
		});
	}

	dispose() {
		this.#batch.clear();
	}
}

export default SimpleEventEmitter;
