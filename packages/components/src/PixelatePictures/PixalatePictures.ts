const html = `
<style>
	.container {
		position: relative;
		width:100%;
	}
	
	.img {
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
    <div class="img">
        <slot></slot>
    </div>
    <canvas></canvas>
</div>
`
class PixalatePictures extends HTMLElement {
    static readonly name = 'pixelate-pictures';
    readonly shadowRoot: ShadowRoot;
    #canvas: HTMLCanvasElement;
    constructor() {
        super();

        let template = document.createElement('template');
        template.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.#canvas = this.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
    }
}

export default PixalatePictures;