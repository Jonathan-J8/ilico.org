import { Feed, PixelateImage, PixelateVideos, ScrambleText } from 'ilico-components';
import animateHeader from './animateHeader';
import { frames } from './globals';
import './style.css';

PixelateVideos.frames = frames;
ScrambleText.frames = frames;
frames.play();

customElements.define(ScrambleText.name, ScrambleText);
customElements.define(PixelateVideos.name, PixelateVideos);
customElements.define(PixelateImage.name, PixelateImage);
customElements.define(Feed.name, Feed);
animateHeader();

document.querySelector('#theme-controller > input')?.addEventListener('change', (e) => {
	// const el = document.querySelector('#theme-controller > span') as HTMLElement;
	// if (!el) return;
	const { checked } = e.target as HTMLInputElement;

	const theme = checked ? 'dark' : 'light';
	document.documentElement.setAttribute('data-theme', theme);

	// el.innerText = toggle.checked ? 'Dark' : 'Light';
});
// (async () => {
//     const url = new URL(window.location.href);
//     const debug = url.searchParams.has('debug') ? true : false;
//     const canvas = document.getElementById('canvas') as HTMLCanvasElement;
//     const webgl = (await import('pkg-webgl')).default;
//     const dispose = webgl({canvas, debug, controls: false});
//     import.meta.hot?.dispose(dispose);
// })();
