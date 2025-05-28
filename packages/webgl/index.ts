import './index.css';

(async () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const init = (await import('./src')).default;
	const dispose = init({ canvas, debug: true, controls: false });
	import.meta.hot?.dispose(dispose);
})();
