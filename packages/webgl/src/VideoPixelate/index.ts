import BatchFunction from '../utils/BatchFunction';
import renderer from './renderer';
import html from './VideoPixelate.html?raw';

class VideoPixelate extends HTMLElement {
	static observedAttributes = ['src', 'delay'];
	static name = 'video-pixelate';

	private animationsKiller = new BatchFunction();

	readonly shadowRoot: ShadowRoot;

	delay = 0;

	constructor() {
		super();
		let template = document.createElement('template');
		template.innerHTML = html;
		this.shadowRoot = this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.animationsKiller.run();
		this.animationsKiller.dispose();

		const observer = new IntersectionObserver(
			(entries) => {
				const { intersectionRatio } = entries[0];
				if (intersectionRatio !== 1) return; // nothing to animate
			},
			{ threshold: 1 }
		);
		observer.observe(this);

		const canvas = this.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
		const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
		const video = slot.assignedElements()[0];
		if (!(video instanceof HTMLVideoElement))
			throw new Error('<video-pixelate/> must have a <video/> at first child');

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		try {
			renderer({ canvas, video });
		} catch (e) {
			console.trace(e);
		}
	}

	//@ts-ignore
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'value') {
			return;
		}
		if (name === 'delay') {
			this.delay = parseInt(newValue || '0');
			return;
		}
	}
}

export default VideoPixelate;
