import { clamp } from "three/src/math/MathUtils.js";
import BatchFunction from "../utils/BatchFunction";

class Resizer extends BatchFunction<
  [{ width: number; height: number; pixelRatio: number }]
> {
  #maxSize = 7680;
  #width = 100;
  #height = 100;
  #pixelRatio = 1;
  #resolutionFactor = 1;
  #element: HTMLElement | undefined;

  constructor() {
    super();
  }

  get width() {
    return this.#width * this.#resolutionFactor;
  }
  get height() {
    return this.#height * this.#resolutionFactor;
  }
  get pixelRatio() {
    return this.#pixelRatio;
  }
  get maxSize() {
    return this.#maxSize;
  }
  get resolutionFactor() {
    return this.#resolutionFactor;
  }

  run = () => {
    let width = this.#width;
    let height = this.#height;
    const pixelRatio = this.#pixelRatio;

    // if (this.#maxSize !== Infinity) {
    if (this.#width > this.#maxSize || this.#height > this.#maxSize) {
      if (width > height) {
        const ratio = height / width;
        width = clamp(width, 0, this.#maxSize);
        height = width * ratio;
      } else {
        const ratio = width / height;
        height = clamp(height, 0, this.#maxSize);
        width = height * ratio;
      }
    }

    width *= this.#resolutionFactor;
    height *= this.#resolutionFactor;

    super.run({ width, height, pixelRatio });
  };

  set resolutionFactor(n: number) {
    this.#resolutionFactor = clamp(n, 0.01, 1);
    this.run();
  }

  set maxSize(n: number) {
    this.#maxSize = n < 32 ? 32 : n;
    this.run();
  }

  #observer = new ResizeObserver((entries) => {
    const box = entries[0].contentBoxSize[0];
    const { inlineSize: width, blockSize: height } = box;
    if (this.#width === width && this.#height === height) return; // no need to resize

    this.#width = width;
    this.#height = height;
    this.run();
  });

  attachDomElement = (el: HTMLElement) => {
    if (this.#element) return;
    this.#pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.#element = el;
    this.#observer.observe(el);
    this.run();
  };

  dispose() {
    super.dispose();
    if (this.#element) this.#observer.unobserve(this.#element);
    this.#observer.disconnect();
  }
}

export default Resizer;
