import { Vector2, VideoTexture } from 'three';
import BatchFunction from '../utils/BatchFunction';
import init from './init';
import html from './VideoPixelate.html?raw';

class VideoPixelate extends HTMLElement {
	static observedAttributes = ['src', 'delay'];
	static name = 'video-pixelate';

	private animationsKiller = new BatchFunction();
	private currentVideoIndex = 0;
	private videoTextures: VideoTexture[] = [];
	private uniforms = {
		u_map_a: { value: null },
		u_map_b: { value: null },
		u_resolution: { value: new Vector2(0, 0) },
		u_pixel_size: { value: 15 },
	};

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
		// DefaultLoadingManager.onLoad = () => console.log('all loaded');

		const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
		slot.assignedElements().forEach((el, i) => {
			if (!(el instanceof HTMLVideoElement))
				throw new Error('<video-pixelate/> must have a <video/> at first child');
			if (i === 0) el.play();

			el.addEventListener('play', this.videoPlay);
			const texture = new VideoTexture(el);
			el.dataset['uuid'] = texture.uuid;
			this.videoTextures.push(texture);
		});

		this.uniforms.u_resolution.value.set(canvas.width, canvas.height);
		init({ canvas, uniforms: this.uniforms });

		this.uniforms.u_map_a.value = this.videoTextures[0];
		this.uniforms.u_map_b.value = this.videoTextures[1];
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

	private videoPlay = (e: Event) => {
		const el = e.target as HTMLVideoElement;
		const uuid = el.dataset['uuid'];
		const textureA = this.uniforms.u_map_a.value;
		// const textureB = this.uniforms.u_map_b.value;
		const len = this.videoTextures.length;
		this.currentVideoIndex = (this.currentVideoIndex + 1) % (len - 1);
		const nextVideoTexture = this.videoTextures[this.currentVideoIndex];
		if (uuid === textureA?.uuid) this.uniforms.u_map_a.value = nextVideoTexture;
		else this.uniforms.u_map_b.value = nextVideoTexture;
	};

	disconnectedCallback() {
		while (this.videoTextures.length > 0) {
			const lastIndex = this.videoTextures.length - 1;
			this.videoTextures[lastIndex].dispose();
			this.videoTextures.pop();
		}

		const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
		slot.assignedElements().forEach((el, i) => {
			el.removeEventListener('play', this.videoPlay);
		});
	}
}

export default VideoPixelate;
