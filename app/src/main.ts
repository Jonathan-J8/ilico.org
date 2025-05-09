import './style.css';
import Typewriter from './Typewriter';

customElements.define(Typewriter.name, Typewriter);

(async () => {
	// const debug = import.meta.env.DEV;

	const url = new URL(window.location.href);
	const debug = url.searchParams.has('debug') ? true : false;
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;

	const webgl = (await import('webgl')).default;
	const dispose = webgl({ canvas, debug, controls: false });

	import.meta.hot?.dispose(() => {
		dispose();
	});
})();
