import Consumer from "app/src/news/consumer.ts";

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
    readonly consumer: Consumer;


    constructor() {
        super();
        let temp = document.createElement('template');
        temp.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(temp.content.cloneNode(true));
        this.consumer = new Consumer();
    }

    async connectedCallback() {
        console.log('Feed instantiated');
        await this.consumer.getData();
    }
}

export default Feed;