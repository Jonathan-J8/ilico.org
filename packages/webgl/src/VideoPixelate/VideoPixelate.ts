import { clamp } from 'three/src/math/MathUtils.js';
import Frames from '../three/Frames';
import html from './template.html?raw';
import WebGLApp from './WebGLApp';

class VideoPixelate extends HTMLElement {
	static readonly name = 'video-pixelate';
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
		const canvas = this.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
		this.webgl = new WebGLApp(canvas);
	}

	getVideoElements = () => {
		return this.shadowRoot.querySelector('slot')?.assignedElements() as HTMLVideoElement[];
	};

	disconnectedCallback() {
		VideoPixelate.frames.dispose();
		this.webgl?.dispose();
	}

	connectedCallback() {
		VideoPixelate.frames.add(this.webgl.update);
		VideoPixelate.frames.play();

		let index = 0;
		this.next({ index });

		setInterval(() => {
			++index;

			this.next({ index });
		}, 4000);
	}

	next = ({ index }: { index: number }) => {
		if (!this.webgl) return;

		const { uniforms } = this.webgl;
		const videos = this.getVideoElements();
		const nextIndex = index % videos.length;
		const nextVideo = videos[nextIndex];

		if (this.shiftTexture) uniforms.textureB(nextVideo);
		else uniforms.textureA(nextVideo);

		// uniforms.blend(to);
		this.shiftTexture = !this.shiftTexture;

		let pixelSize = 0;
		const max = 100;
		const min = 0.01;
		const gap = 10;
		let inverse = false;
		VideoPixelate.frames.animation({
			steps: 20,
			duration: 1000,
			iterations: 1,
			onUpdate: () => {
				if (pixelSize === 100) inverse = true;
				pixelSize = inverse ? pixelSize - gap : pixelSize + gap;
				pixelSize = clamp(pixelSize, min, max);
				console.log(pixelSize);
				uniforms.pixelSize(pixelSize);
			},
		});
	};
}

customElements.define(VideoPixelate.name, VideoPixelate);

export default VideoPixelate;
