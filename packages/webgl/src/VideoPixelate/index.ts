import Frames from '../three/Frames';
import BatchFunction from '../utils/BatchFunction';
import html from './VideoPixelate.html?raw';
import WebGLApp from './WebGLApp';

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

	getVideoElements = () => {
		return this.shadowRoot.querySelector('slot')?.assignedElements() as HTMLVideoElement[];
	};
	connectedCallback() {
		this.bin.run();
		this.bin.dispose();

		const canvas = this.shadowRoot.querySelector('canvas') as HTMLCanvasElement;

		this.webgl = new WebGLApp(canvas);

		this.bin.add(() => this.frames.dispose());
		this.frames.add((t) => {
			if (!this.webgl) return;
			this.webgl.update();
		});
		this.frames.play();

		// let bool = false;

		let index = 0;
		let shift = false;
		this.next({ index, shift });

		setInterval(() => {
			++index;
			shift = !shift;
			this.next({ index, shift });
		}, 2000);
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

	next = ({ index, shift }: { index: number; shift: boolean }) => {
		if (!this.webgl) return;

		const { textureA, textureB } = this.webgl.textures;
		const { uniforms } = this.webgl;
		const videos = this.getVideoElements();

		const nextIndex = index % videos.length;
		const nextVideo = videos[nextIndex];

		if (shift) textureB.value = nextVideo;
		else textureA.value = nextVideo;

		const from = shift ? 0 : 1;
		const to = 1 - from;

		uniforms.blend(to);

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

	disconnectedCallback() {
		this.bin.run();
		this.bin.dispose();
	}
}

customElements.define(VideoPixelate.name, VideoPixelate);

export default VideoPixelate;
