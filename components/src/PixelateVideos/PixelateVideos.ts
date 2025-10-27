import { Animator, clamp } from 'joeat-utils';
import WebGLApp from './WebGLApp';
import * as mouse from './mouse';

const html = `
<style>
	.container {
		position: relative;
		width:100%;
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

class PixelateVideos extends HTMLElement {
	static readonly name = 'pixelate-videos';
	static observedAttributes = ['video'];
	static frames = new Animator();
	readonly shadowRoot: ShadowRoot;
	private canvas: HTMLCanvasElement;
	private webgl: WebGLApp;
	private shiftTexture = true;
	delay = 0;
	constructor() {
		super();

		let template = document.createElement('template');
		template.innerHTML = html;
		this.shadowRoot = this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.canvas = this.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
		if (!this.canvas) throw new Error('PixelateVideos: no canvas found');
		this.webgl = new WebGLApp(this.canvas);
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

		PixelateVideos.frames.animate({
			steps: (max / gap) * 2,
			duration: 1500,
			delay: 0,
			iterations: 1,
			onUpdate: () => {
				if (pixelSize === max) {
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

	update = () => {
		if (!this.webgl) return;
		const { uniforms } = this.webgl;
		const { position, velocity } = mouse.data;
		const { clientWidth, clientHeight } = this.canvas;
		// const x = ((e.offsetX / clientWidth) * 2 - 1) * 0.5;
		// const y = (-(e.offsetY / clientHeight) * 2 + 1) * 0.5;
		// const velX = e.movementX; //* 0.1;
		// const velY = e.movementY; //* 0.1;
		const x = ((position.current.x / clientWidth) * 2 - 1) * 0.5;
		const y = (-(position.current.y / clientHeight) * 2 + 1) * 0.5;
		const velX = velocity.current.y; //* 0.1;
		const velY = velocity.current.y; //* 0.1;
		uniforms.mousePosition(x, y);
		uniforms.mouseVelocity(velX, velY);

		this.webgl.update();
	};

	connectedCallback() {
		PixelateVideos.frames.addListener(mouse.onUpdate);
		PixelateVideos.frames.addListener(this.update);
		this.canvas.addEventListener('pointermove', mouse.onPointerMove, false);
		this.canvas.addEventListener('pointerout', mouse.onPointerOut, false);

		let pixelSize = 50;
		const max = pixelSize;
		const min = 0.01;
		const gap = 10;
		const { uniforms } = this.webgl;
		const videos = this.getVideoElements();

		const firstVideo = videos[0];
		firstVideo.currentTime = 0;

		uniforms.textureA(firstVideo);
		uniforms.pixelSize(pixelSize);
		uniforms.blend(0);

		PixelateVideos.frames.animate({
			steps: max / gap,
			duration: 500,
			delay: 300,
			iterations: 1,
			onUpdate: () => {
				pixelSize -= gap;
				pixelSize = clamp(pixelSize, min, max);
				uniforms.pixelSize(pixelSize);
			},
		});
	}

	disconnectedCallback() {
		PixelateVideos.frames.removeListener(mouse.onUpdate);
		PixelateVideos.frames.removeListener(this.update);
		this.canvas.removeEventListener('pointermove', mouse.onPointerMove, false);
		this.canvas.removeEventListener('pointerout', mouse.onPointerOut, false);
		this.webgl.dispose();
	}

	// @ts-ignore
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

export default PixelateVideos;
