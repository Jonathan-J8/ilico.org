import { Animator } from 'joeat-utils';
import WebGLApp from './WebGLApp';
import * as mouse from './mouse';
const html = `
<style>

	canvas {
		position: fixed;
		width: 100%;
		height: 100vh;
		background-color: transparent;
		min-width: 150px;
		min-height: 150px;
	}
</style>
<canvas class="container">
</canvas>

`;

class PixelateBackground extends HTMLElement {
	static readonly name = 'pixelate-background';
	static frames = new Animator();
	readonly shadowRoot: ShadowRoot;
	private canvas: HTMLCanvasElement;
	private webgl: WebGLApp;
	constructor() {
		super();

		let template = document.createElement('template');
		template.innerHTML = html;
		this.shadowRoot = this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.canvas = this.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
		if (!this.canvas) throw new Error('PixelateBackground: no canvas found');
		this.webgl = new WebGLApp(this.canvas);
	}

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
		PixelateBackground.frames.addListener(mouse.onUpdate);
		PixelateBackground.frames.addListener(this.update);
		window.addEventListener('scroll', mouse.onWindowScroll, false);
		this.canvas.addEventListener('pointermove', mouse.onPointerMove, false);
		this.canvas.addEventListener('pointerout', mouse.onPointerOut, false);
	}

	disconnectedCallback() {
		PixelateBackground.frames.removeListener(mouse.onUpdate);
		PixelateBackground.frames.removeListener(this.update);
		window.removeEventListener('scroll', mouse.onWindowScroll, false);
		this.canvas.removeEventListener('pointermove', mouse.onPointerMove, false);
		this.canvas.removeEventListener('pointerout', mouse.onPointerOut, false);
		this.webgl.dispose();
	}
}

export default PixelateBackground;
