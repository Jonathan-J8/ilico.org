import WebGLApp from "./WebGLApp.ts";

const html = `
<style>
	.container {
		position: relative;
		width:100%;
	}
	.img {
		position: absolute;	
	}
	canvas {
        overflow: hidden;
	}
</style>
<div class="container">
    <div class="img">
        <slot></slot>
    </div>
    <canvas></canvas>
</div>

`


class PixelateImages extends HTMLElement {
    static readonly name = 'pixelate-img';
    readonly shadowRoot: ShadowRoot;
    imagePath: string = '';
    static observedAttributes = ['src'];
    private readonly image = new Image;
    private readonly canvas: HTMLCanvasElement | null;
    private readonly webGLApp: WebGLApp;
    private observer: any;

    constructor() {
        super();

        // Web component
        let template = document.createElement('template');
        template.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.canvas = this.shadowRoot.querySelector('canvas');
        if (!this.canvas) throw new Error('PixelateImages: no canvas found');
        this.webGLApp = new WebGLApp(this.canvas);
    }

    connectedCallback() {
        this.initiateLazyLoading();
        window.addEventListener('resize', this.webGLApp.resize);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.webGLApp.resize);
        if (this.observer) this.observer.disconnect();
        this.observer = undefined;
    }

    // @ts-ignore
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'src') {
            this.imagePath = newValue;
            return;
        }
    }

    private initiateLazyLoading() {
        this.observer = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    this.image.onload = () => {
                        console.log(this.canvas?.clientWidth);
                        this.webGLApp.resize();
                        this.webGLApp.update(this.image);

                    }
                    this.image.src = this.imagePath;
                    this.observer.unobserve(this);

                }
            }, {threshold: 0}
        );
        this.observer.observe(this);
    }
}

export default PixelateImages;