import Consumer from './consumer.ts';

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
    baseUrl: string = '';
    static observedAttributes = ['src'];


    constructor() {
        super();
        let temp = document.createElement('template');
        temp.innerHTML = html;
        this.shadowRoot = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(temp.content.cloneNode(true));
        this.consumer = new Consumer();
    }

    async connectedCallback(){
        const posts = await this.consumer.getData(this.baseUrl);
        const list = document.createElement('ul');
        posts.slice(0, 3).forEach(post => {
            const item = document.createElement('li');
            item.innerHTML = `
        <h5>
            <a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a>
        </h5>
        <p>${post.excerpt}</p>
      `;
            list.appendChild(item);
        });
        this.shadowRoot.append(list);
    }

    // @ts-ignore
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'src') {
            this.baseUrl = newValue;
            return;
        }
    }
}

export default Feed;