import './style.css';

(async () => {
	// const debug = import.meta.env.DEV;
	const debug = false;
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;

	const webgl = (await import('webgl')).default;
	const dispose = webgl({ canvas, debug });

	import.meta.hot?.dispose(() => {
		dispose();
	});
})();
