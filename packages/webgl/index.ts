(async () => {
	const module = (await import('./src')).default;
	const debug = import.meta.env.DEV;
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	module({ canvas, debug });
})();
