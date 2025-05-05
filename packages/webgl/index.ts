import './index.css';

(async () => {
	const module = (await import('./src')).default;
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	module({ canvas, debug: true });
})();
