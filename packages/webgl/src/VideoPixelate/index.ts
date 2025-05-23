import { Vector2, VideoTexture } from 'three';
import Frames from '../three/Frames';
import BatchFunction from '../utils/BatchFunction';
import html from './VideoPixelate.html?raw';
import WebGLApp from './WebGLApp';

type Uniforms = {
	u_map_a: { value: null | VideoTexture };
	u_map_b: { value: null | VideoTexture };
	u_resolution: { value: Vector2 };
	u_pixel_size: { value: number };
	u_fade: { value: number };
};

class VideoPixelate extends HTMLElement {
	static observedAttributes = ['src', 'delay'];
	static name = 'video-pixelate';

	private frames = new Frames();
	private bin = new BatchFunction<[]>();
	private webgl: WebGLApp | undefined;

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
		this.bin.run();
		this.bin.dispose();

		// const observer = new IntersectionObserver(
		// 	(entries) => {
		// 		const { intersectionRatio } = entries[0];
		// 		if (intersectionRatio !== 1) return; // nothing to animate
		// 	},
		// 	{ threshold: 1 }
		// );
		// observer.observe(this);

		const canvas = this.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
		const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;

		slot.assignedElements().forEach((el, i) => {
			if (!(el instanceof HTMLVideoElement))
				throw new Error('VideoPixelate: <video-pixelate/> require <video/> childs');
			// if (i === 0) this.currentVideo = el;
			// el.videoWidth;
			// el.addEventListener('play', this.videoPlay);
			// const texture = new VideoTexture(el);
			// el.dataset['uuid'] = texture.uuid;
			el.dataset['index'] = `${i}`;
			// this.videoTextures.push(texture);
		});

		let bool = false;
		const videoA = slot.assignedElements()[0] as HTMLVideoElement;
		this.webgl = new WebGLApp(canvas);
		this.webgl.textures.u_texture_a.value = videoA;

		this.bin.add(() => this.frames.dispose());
		this.frames.add((t) => {
			if (!this.webgl) return;
			this.webgl.update();
		});
		setInterval(() => {
			if (!this.webgl) return;
			this.webgl.uniforms.u_blend.value = bool ? 0.1 : 0.9;
			const videoA = slot.assignedElements()[+bool] as HTMLVideoElement;
			const videoB = slot.assignedElements()[+!bool] as HTMLVideoElement;
			this.webgl.textures.u_texture_a.value = videoA;
			this.webgl.textures.u_texture_b.value = videoB;
			bool = !bool;
		}, 2000);
		this.frames.play();
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

	next = () => {
		// const el = this.currentVideo;
		// if (!el) throw new Error('VideoPixelate: current video element not found');
		// const uuid = el.dataset['uuid'];
		// const index = parseInt(el.dataset['index'] || '0');
		// const textureA = this.uniforms.u_map_a.value;
		// // const textureB = this.uniforms.u_map_b.value;
		// const len = this.videoTextures.length;
		// const nextIndex = (index + 1) % (len - 1);
		// const nextVideoTexture = this.videoTextures[nextIndex];
		// if (uuid !== textureA?.uuid) this.uniforms.u_map_a.value = nextVideoTexture;
		// else this.uniforms.u_map_b.value = nextVideoTexture;
	};

	disconnectedCallback() {
		this.bin.run();
		this.bin.dispose();

		// const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
		// slot.assignedElements().forEach((el, i) => {
		// 	el.removeEventListener('play', this.videoPlay);
		// });
	}
}

customElements.define(VideoPixelate.name, VideoPixelate);

export default VideoPixelate;
