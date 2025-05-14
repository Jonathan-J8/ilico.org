/**
 * simple mono event listener
 */

class BatchFunction<T extends any[]> {
  #batch: Set<(...args: T) => void>;

  constructor() {
    this.#batch = new Set<(...args: T) => void>();
  }

  get size() {
    return this.#batch.size;
  }

  add(...callbacks: ((...args: T) => void)[]) {
    for (let i = 0, len = callbacks.length; i < len; i++) {
      this.#batch.add(callbacks[i]);
    }
  }

  remove(...callbacks: ((...args: T) => void)[]) {
    for (let i = 0, len = callbacks.length; i < len; i++) {
      this.#batch.delete(callbacks[i]);
    }
  }

  run(...args: T) {
    this.#batch.forEach((callback) => {
      callback(...args);
    });
  }

  dispose() {
    this.#batch.clear();
  }
}

export default BatchFunction;
