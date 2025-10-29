import { Animator } from 'joeat-utils';
import './style.css';

const animator = new Animator();

(async () => {
	try {
		// Import and define custom elements
		const { PixelateBackground, PixelateVideos, ScrambleText } = await import(
			'ilico-components'
		);
		PixelateVideos.frames = animator;
		ScrambleText.frames = animator;
		customElements.define(ScrambleText.name, ScrambleText);
		customElements.define(PixelateVideos.name, PixelateVideos);
		customElements.define(PixelateBackground.name, PixelateBackground);

		// Load additional modules
		await Promise.all([import('./theme'), import('./header'), import('./form')]);
	} catch (e) {
		console.error('Error loading modules:', e);
	}
	animator.play();
})();
