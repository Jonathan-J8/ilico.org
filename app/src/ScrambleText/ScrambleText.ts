import BatchFunction from '../utils/BatchFunction';
import animate from './animate';

class ScrambleText extends HTMLElement {
	static observedAttributes = ['value', 'intersection', 'delay'];
	static name = 'scramble-text';

	private animationsKiller = new BatchFunction();

	constructor() {
		super();
	}

	private scramble = async (text = '') => {
		const delay = parseInt(this.getAttribute('delay') || '0');

		const kills = animate({
			element: this,
			text,
			delay,
			onComplete: () => {
				this.innerText = text;
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
			this.animationsKiller.run();
			this.scramble(newValue);
			return;
		}
	}
}

export default ScrambleText;
