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
    <canvas></canvas>
</div>
`

class PixelateImage extends HTMLElement {
    static readonly name = 'pixelate-img';
    readonly shadowRoot: ShadowRoot;
    readonly element: Element | null;
    readonly imagePath = './public/ilico_fine.jpg';
    readonly image = new Image;

    constructor() {
        super();

        let template = document.createElement('template');
        template.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.element = document.querySelector('#lazy')
        this.image.src = this.imagePath;
        this.initiateLazyLoading();
    }

    initiateLazyLoading() {
        let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    console.log(entry.target);
                    if (entry.isIntersecting) {
                        let imageElement = entry.target as HTMLImageElement;
                        this.lazyLoad(imageElement);
                        console.log('Image loaded');
                        if (this.element !== null) {
                            observer.unobserve(this.element);
                            console.log('IntersectionObserver detached');
                        }
                    }
                });
            }
        );
        if (this.element !== null) {
            observer.observe(this.element);
            console.log('IntersectionObserver attached');
        } else console.log(this.element);
    }

    lazyLoad(imageElement: HTMLImageElement): void {
        if (imageElement instanceof HTMLImageElement) {
            let i = imageElement as HTMLImageElement;
            i.src = this.image.src;
            console.log('image property src has been edited');
        } else console.log('entry.target is not instance of HTMLImageElement');
    }
}

export default PixelateImage;