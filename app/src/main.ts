import { Feed, PixelateImage, PixelateVideos, ScrambleText } from 'ilico-components';
import { Animator } from 'joeat-utils';
import './style.css';

const animator = new Animator();
PixelateVideos.frames = animator;
ScrambleText.frames = animator;

customElements.define(ScrambleText.name, ScrambleText);
customElements.define(PixelateVideos.name, PixelateVideos);
customElements.define(PixelateImage.name, PixelateImage);
customElements.define(Feed.name, Feed);

document.querySelector('#theme-controller > input')?.addEventListener('change', (e) => {
	const { checked } = e.target as HTMLInputElement;
	const theme = checked ? 'dark' : 'light';
	document.documentElement.setAttribute('data-theme', theme);
});

(async () => {
	try {
		import('./header');
		import('./form');
		animator.play();
	} catch (e) {
		console.error('Error loading modules:', e);
	}

	// const url = new URL(window.location.href);
	// const debug = url.searchParams.has('debug') ? true : false;
	// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	// const webgl = (await import('pkg-webgl')).default;
	// const dispose = webgl({canvas, debug, controls: false});
	// import.meta.hot?.dispose(dispose);
})();
