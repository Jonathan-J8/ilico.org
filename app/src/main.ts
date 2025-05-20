import animateHeader from './animateHeader';
import ScrambleText from './ScrambleText/ScrambleText';
import './style.css';

customElements.define(ScrambleText.name, ScrambleText);
animateHeader();

(async () => {
	// const url = new URL(window.location.href);
	// const debug = url.searchParams.has('debug') ? true : false;
	// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const { VideoPixelate } = await import('webgl');
	customElements.define(VideoPixelate.name, VideoPixelate);

	// const dispose = webgl({ canvas, debug, controls: false });
	// import.meta.hot?.dispose(() => {
	// 	dispose();
	// });
})();
