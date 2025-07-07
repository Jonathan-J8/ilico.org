import {PixelatePictures, PixelateVideos, ScrambleText} from 'pkg-components';
import animateHeader from './animateHeader';
import { frames } from './globals';
import './style.css';

PixelateVideos.frames = frames;
ScrambleText.frames = frames;
frames.play();

customElements.define(ScrambleText.name, ScrambleText);
customElements.define(PixelateVideos.name, PixelateVideos);
customElements.define(PixelatePictures.name,PixelatePictures);
animateHeader();

(async () => {
	const url = new URL(window.location.href);
	const debug = url.searchParams.has('debug') ? true : false;
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const webgl = (await import('pkg-webgl')).default;
	const dispose = webgl({ canvas, debug, controls: false });
	import.meta.hot?.dispose(dispose);
})();
