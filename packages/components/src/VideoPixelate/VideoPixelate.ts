import { clamp, Frames } from 'pkg-utils';
import WebGLApp from './WebGLApp';

const html = `
<style>
	.container {
		position: relative;

		// background-color: yellow;
		// outline: solid 2px black;
		min-width: 500px;
		aspect-ratio: 16/9;
	}

	.video {
		position: absolute;
		top: 0;
		left: 0;
	}

	canvas {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.49);
		min-width: 150px;
		min-height: 150px;
	}
</style>
<div class="container">
	<div class="video">
		<slot></slot>
	</div>
	<canvas></canvas>
</div>

`;

class VideoPixelate extends HTMLElement {
	static readonly name = 'video-pixelate';
	static observedAttributes = ['video'];
	static frames = new Frames();
	readonly shadowRoot: ShadowRoot;
	private webgl: WebGLApp;
	private shiftTexture = false;
	delay = 0;

	constructor() {
		super();

		let template = document.createElement('template');
		template.innerHTML = html;
		this.shadowRoot = this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		const canvas = this.shadowRoot.querySelector('canvas');
		if (!canvas) throw new Error('VideoPixelate: no canvas found');
		this.webgl = new WebGLApp(canvas);
	}

	private getVideoElements = () => {
		return this.shadowRoot.querySelector('slot')?.assignedElements() as HTMLVideoElement[];
	};

	private customAnimation = (index: number) => {
		if (!this.webgl) return;

		const { uniforms } = this.webgl;
		const videos = this.getVideoElements();
		const nextIndex = index % videos.length;
		const nextVideo = videos[nextIndex];
		nextVideo.currentTime = 0;

		if (this.shiftTexture) uniforms.textureB(nextVideo);
		else uniforms.textureA(nextVideo);

		let pixelSize = 0;
		const max = 100;
		const min = 0.01;
		const gap = 10;
		let inverse = false;

		VideoPixelate.frames.animation({
			steps: 20,
			duration: 1500,
			delay: 500,
			iterations: 1,
			onUpdate: () => {
				if (pixelSize === 100) {
					inverse = true;
					uniforms.blend(+!this.shiftTexture);
				}
				pixelSize = inverse ? pixelSize - gap : pixelSize + gap;
				pixelSize = clamp(pixelSize, min, max);
				uniforms.pixelSize(pixelSize);
			},
		});

		this.shiftTexture = !this.shiftTexture;
	};

	connectedCallback() {
		VideoPixelate.frames.add(this.webgl.update);
	}

	disconnectedCallback() {
		this.webgl.dispose();
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'video') {
			this.customAnimation(parseInt(newValue || '0'));
			return;
		}
		if (name === 'delay') {
			this.delay = parseInt(newValue || '0');
			return;
		}
	}
}

export default VideoPixelate;
