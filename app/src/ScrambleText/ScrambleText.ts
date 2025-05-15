import BatchFunction from '../utils/BatchFunction';
import animate from './animate';

class ScrambleText extends HTMLElement {
	static observedAttributes = ['value', 'intersection', 'delay'];
	static name = 'scramble-text';

	private animationsKiller = new BatchFunction();

	delay = 0;

	constructor() {
		super();
	}

	private scramble = async (text = '') => {
		this.animationsKiller.run();
		this.animationsKiller.dispose();
		const kills = animate({
			element: this,
			text,
			onComplete: () => {
				if (this.innerText !== text) this.innerText = text;
			},
		});
		this.animationsKiller.add(...kills);
	};

	private firstScramble = () => {
		const text = this.innerText;
		this.innerText = '';
		this.scramble(text);
	};

	connectedCallback() {
		this.animationsKiller.run();
		this.animationsKiller.dispose();

		if (!this.innerText) return;

		const intersection = this.getAttribute('intersection');
		if (!intersection) {
			this.firstScramble();
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				const { intersectionRatio } = entries[0];
				if (intersectionRatio !== 1) return; // nothing to animate
				this.firstScramble();
				observer.unobserve(this);
				observer.disconnect();
			},
			{ threshold: 1 }
		);
		observer.observe(this);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'value') {
			this.scramble(newValue);
			return;
		}
		if (name === 'delay') {
			this.delay = parseInt(newValue || '0');
			return;
		}
	}
}

export default ScrambleText;
