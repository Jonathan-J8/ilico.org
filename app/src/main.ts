import './style.css';
import Typewriter from './Typewriter';

customElements.define(Typewriter.name, Typewriter);

(async () => {
	// const debug = import.meta.env.DEV;
	const debug = false;
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;

	const webgl = (await import('webgl')).default;
	const dispose = webgl({ canvas, debug, controls: false });

	import.meta.hot?.dispose(() => {
		dispose();
	});
})();
