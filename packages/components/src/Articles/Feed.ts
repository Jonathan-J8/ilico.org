const html = `
<style>
	.container {
		position: relative;
		width:100%;
	}
	.feed {
		position: absolute;	
	}
</style>
<div class="container">
    <div class="feed">
        <slot></slot>
    </div>
</div>`

class Feed extends HTMLElement {
    static readonly name = 'news-feed';
    readonly shadowRoot: ShadowRoot;


    constructor() {
        super();
        let temp = document.createElement('template');
        temp.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(temp.content.cloneNode(true));

    }

    connectedCallback() {
        console.log('Feed instanciated');
    }
}

export default Feed;