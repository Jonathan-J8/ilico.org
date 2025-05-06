import { lerp } from 'three/src/math/MathUtils.js';

const damp2 = (x: number, y: number, lambda: number, dt: number, threshold = 0.0001) => {
	if (x <= y + threshold && x >= y - threshold) return y;
	return lerp(x, y, 1 - Math.exp(-lambda * dt));
};

export default damp2;
