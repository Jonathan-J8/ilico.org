import { ScrambleText, VideoPixelate } from 'pkg-components';
import animateHeader from './animateHeader';
import { frames } from './globals';
import './style.css';

VideoPixelate.frames = frames;
ScrambleText.frames = frames;
frames.play();

customElements.define(ScrambleText.name, ScrambleText);
customElements.define(VideoPixelate.name, VideoPixelate);

animateHeader();

(async () => {
	// const url = new URL(window.location.href);
	// const debug = url.searchParams.has('debug') ? true : false;
	// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	// const { VideoPixelate } = await import('webgl');
	// const dispose = webgl({ canvas, debug, controls: false });
	// import.meta.hot?.dispose(() => {
	// 	dispose();
	// });
})();
