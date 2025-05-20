import './index.css';

(async () => {
	const { initWebglApp } = await import('./src');
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	initWebglApp({ canvas, debug: true, controls: false });
})();
