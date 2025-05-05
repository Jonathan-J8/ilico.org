// import html from './Typewriter.html?raw';

class Typewriter extends HTMLElement {
	static name = 'typewriter-auto';
	// shadowRoot: ShadowRoot;

	constructor() {
		super();

		// const template = document.createElement('template');
		// template.innerHTML = html;
		// this.shadowRoot = this.attachShadow({ mode: 'open' });
		// this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		const el = Array.from(this.children).find((el) => el.className.match(/typewriter/));
		if (!el || !(el instanceof HTMLElement)) return;
		const delay = parseInt(el.getAttribute('delay') || '10');
		const text = el.innerText; //.split('');
		let inc = 0;
		// let text2 = '';
		// const total = characters.length;
		// for (let i = 0, len = text.length; i < len; ++i) {
		// 	const rd = Math.floor(Math.random() * total);
		// 	text2 += characters[rd];
		// }
		// el.innerText = text2;

		await new Promise((res) => setTimeout(res, delay));
		let id = setInterval(() => {
			let char = text[inc];
			// if (char === ' ') el.innerHTML += '&nbsp;';
			// else
			el.innerText += char;
			inc += 1;
			if (inc > text.length - 1) clearInterval(id);
		}, 40);
	}
}

export default Typewriter;
