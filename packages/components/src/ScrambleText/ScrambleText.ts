import { BatchFunction, Frames } from 'pkg-utils';
import { getRandomAsciiChar, prepareAnimation } from './utils';

class ScrambleText extends HTMLElement {
	static readonly name = 'scramble-text';
	static observedAttributes = ['value', 'intersection', 'delay'];
	static frames = new Frames();
	private bin = new BatchFunction();
	delay = 0;

	constructor() {
		super();
	}

	customAnimation = (text: string) => {
		this.bin.run();
		this.bin.dispose();
		const animation = prepareAnimation(this, text);
		let current = this.innerText.split('');
		let inc = 0;

		for (let i = 0, len = animation.length; i < len; ++i) {
			const { from, to, index, delay, steps, duration } = animation[i];
			const charToRemove = from && !to;
			const newDelay = delay + this.delay;

			const kill = ScrambleText.frames.animation({
				steps,
				duration,
				delay: newDelay,
				onUpdate: () => {
					const char = getRandomAsciiChar();
					current[index] = char;
					this.innerText = current.join('');
				},
				onComplete: () => {
					if (charToRemove) current.pop();
					else current[index] = to;
					this.innerText = current.join('');

					if (++inc === len && this.innerText !== text) this.innerText = text;
				},
			});
			this.bin.add(kill);
		}
	};

	private animeIn = () => {
		const text = this.innerText;
		this.innerText = '';
		this.customAnimation(text);
	};

	connectedCallback() {
		this.bin.run();
		this.bin.dispose();

		if (!this.innerText) return;

		const intersection = this.getAttribute('intersection');
		if (!intersection) {
			this.animeIn();
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				const { intersectionRatio } = entries[0];
				if (intersectionRatio !== 1) return; // nothing to animate
				this.animeIn();
				observer.unobserve(this);
				observer.disconnect();
			},
			{ threshold: 1 }
		);
		observer.observe(this);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'value') {
			this.customAnimation(newValue);
			return;
		}
		if (name === 'delay') {
			this.delay = parseInt(newValue || '0');
			return;
		}
	}
}

export default ScrambleText;
