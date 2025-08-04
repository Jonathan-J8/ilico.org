const lerp = (x: number, y: number, t: number) => {
	return (1 - t) * x + t * y;
};
const damp2 = (x: number, y: number, lambda: number, dt: number, threshold = 0.0001) => {
	if (x <= y + threshold && x >= y - threshold) return x;
	return lerp(x, y, 1 - Math.exp(-lambda * dt));
};

export default damp2;
