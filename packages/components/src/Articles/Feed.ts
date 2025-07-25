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
        const posts = await this.consumer.getData();

        // Create a list element
        const list = document.createElement('ul');

        // For each post, create a list item with title and excerpt
        posts.slice(0, 3).forEach(post => {
            const item = document.createElement('li');
            item.innerHTML = `
        <h5><a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a></h5>
        <div>${post.excerpt}</div>
      `;
            list.appendChild(item);
        });

        // Clear any old content and append the list
        this.shadowRoot.append(list);
    }
}

export default Feed;