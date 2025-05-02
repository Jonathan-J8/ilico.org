// https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/
type SpringCallback = (o: Spring["value"]) => void;

type Options = {
  mass?: number;
  tension?: number;
  friction?: number;
  threshold?: number;
  onUpdate?: SpringCallback;
  onComplete?: SpringCallback;
};
type RequiredOptions = {
  mass: number;
  tension: number;
  friction: number;
  threshold: number;
  onUpdate: SpringCallback | undefined;
  onComplete: SpringCallback | undefined;
};

export default class Spring {
  #options: RequiredOptions = {
    mass: 0.5,
    tension: 0.5,
    friction: 0.5,
    threshold: 0.1,
    onUpdate: undefined,
    onComplete: undefined,
  };

  #to = 0;
  #from = 0;
  #value = 0;
  #velocity = 0;
  #finished = false;

  get value() {
    return this.#value;
  }
  get velocity() {
    return this.#velocity;
  }
  get finished() {
    return this.#finished;
  }

  constructor(value?: number, options?: Options) {
    this.#value = value || 0;
    this.#from = value || 0;
    this.#options = { ...this.#options, ...options };
  }

  from = (value: number) => {
    this.#from = value;
    this.#value = value;
    return this;
  };

  to = (v: number, o?: Options) => {
    this.#to = v;
    if (
      Math.abs(this.#velocity) < this.#options.threshold &&
      Math.abs(this.#to - this.#value) < this.#options.threshold
    )
      return this;
    if (o) this.#options = { ...this.#options, ...o };
    this.#finished = false;
    return this;
  };

  update = (delta: number) => {
    if (this.#finished) return;
    const { mass, tension, friction, threshold, onComplete, onUpdate } =
      this.#options;

    // const normalizedDelta = Math.min(delta * 0.001, 0.046);
    const normalizedDelta = Math.min(delta, 0.046);
    const prevVelocity = this.#velocity ?? 0;
    const prevValue =
      typeof this.#value === "number" ? this.#value : this.#from;

    const restoringForce = -1 * tension * (prevValue - this.#to);
    const dampingForce = -1 * prevVelocity * friction;
    const acceleration = (restoringForce + dampingForce) / mass;

    const newVelocity = prevVelocity + acceleration * normalizedDelta;
    const newValue = prevValue + newVelocity * normalizedDelta;

    this.#finished =
      Math.abs(newVelocity) < threshold &&
      Math.abs(newValue - this.#to) < threshold;
    this.#value = this.finished ? this.#to : newValue;
    this.#velocity = newVelocity;

    if (!this.#finished) {
      if (onUpdate) onUpdate(this.#value);
    } else {
      this.#value = this.#to;
      // if (onUpdate) onUpdate(this.#value);
      if (onComplete) onComplete(this.#value);
    }
  };
}
