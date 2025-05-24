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
		}, 2000);
	}

	next = ({ index }: { index: number }) => {
		if (!this.webgl) return;

		const { uniforms } = this.webgl;
		const videos = this.getVideoElements();
		const nextIndex = index % videos.length;
		const nextVideo = videos[nextIndex];

		if (this.shiftTexture) uniforms.textureB(nextVideo);
		else uniforms.textureA(nextVideo);

		const from = this.shiftTexture ? 0 : 1;
		const to = 1 - from;

		uniforms.blend(to);
		this.shiftTexture = !this.shiftTexture;

		// let blend = shift? 0:1;
		// this.frames.animation({duration:200,onUpdate:()=>{
		// 	// blend += 0.01;

		// }})
		// this.frames.interpolate({
		// 	from,
		// 	to,
		// 	onUpdate: ({ value }) => {
		// 		console.log(nextIndex, value);

		// 	},
		// });
	};
}

customElements.define(VideoPixelate.name, VideoPixelate);

export default VideoPixelate;
