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
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.49);
		min-width: 150px;
		min-height: 150px;
	}
</style>
<div class="container">
    <div class="img">
        <slot></slot>
    </div>
    <canvas class="webgl-canva"></canvas>
</div>
`


class PixelateImage extends HTMLElement {
    static readonly name = 'pixelate-img';
    readonly shadowRoot: ShadowRoot;
    imagePath: string = '';
    static observedAttributes = ['src'];
    private readonly image = new Image;
    private readonly canvas: HTMLCanvasElement | null;

    constructor() {
        super();

        // Web component
        let template = document.createElement('template');
        template.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.appendChild(this.image);
        this.shadowRoot.querySelector('.img')?.appendChild(this.image);



        // Lazy loading

        this.canvas = this.shadowRoot.querySelector('canvas');
        if (!this.canvas) throw new Error('PixelateImages: no canvas found');
        new WebGLApp(this.canvas);
    }

    connectedCallback() {
        this.initiateLazyLoading();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'src') {
            this.imagePath = newValue;
            return;
        }
    }

    private initiateLazyLoading() {
        let observer = new IntersectionObserver((entries, observer) => {
                const entry = entries[0];
                console.log(entry);
                if (entry.isIntersecting) {
                    this.image.src = this.imagePath;
                    console.log('Image loaded');

                    observer.unobserve(this);
                    console.log('IntersectionObserver detached');

                }
            }, {threshold: 0}
        );
        observer.observe(this);
        console.log('IntersectionObserver attached');

    }
}

export default PixelateImage;