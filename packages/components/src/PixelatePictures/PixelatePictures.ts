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
class PixelatePictures extends HTMLElement {
    static readonly name = 'pixelate-pictures';
    readonly shadowRoot: ShadowRoot;
    constructor() {
        super();

        let template = document.createElement('template');
        template.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

export default PixelatePictures;