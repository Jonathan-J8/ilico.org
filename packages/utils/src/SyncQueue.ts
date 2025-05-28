export type TaskQueue = (() => void) | (() => Promise<unknown>);

export default class SyncQueue {
	#queue: TaskQueue[] = [];
	#isRunning = false;
	#shouldAbort = false;

	get isRunning() {
		return this.#isRunning;
	}
	constructor() {
		this.#queue = [];
		this.#isRunning = false;
		this.#shouldAbort = false; // Abort flag
	}

	add(...task: TaskQueue[]) {
		this.#queue.push(...task);
		if (!this.#isRunning) this.#run();
	}

	async #run() {
		/**
		 * Run all tasks in the queue sequentially.
		 * This ensures tasks run only once even if run() is called repeatedly.
		 */
		if (this.#isRunning) return;

		this.#isRunning = true;
		this.#shouldAbort = false;

		while (this.#queue.length > 0 && !this.#shouldAbort) {
			const task = this.#queue.shift(); // Remove the first task from the queue
			try {
				if (typeof task === 'function') await task();

				// else throw new Error('queued task is not a function');
			} catch (error) {
				console.error('SyncQueue error:', error);
			}
		}

		this.#isRunning = false;
	}

	abort() {
		this.#shouldAbort = true;
	}
}
