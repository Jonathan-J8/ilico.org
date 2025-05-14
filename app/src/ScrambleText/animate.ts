import frames from '../frames';
import { getRandomAsciiChar, prepareText, replaceCharAtIndex } from './utils';

const animate = ({
	element,
	text,
	onComplete,
	delay,
}: {
	element: HTMLElement;
	text: string;
	onComplete: () => void;
	delay?: number;
}) => {
	const animation = prepareText(element, text);
	const kills = [];

	const offsetDelay = delay || 0;

	let inc = 0;
	for (let i = 0, len = animation.length; i < len; i++) {
		const { from, to, index } = animation[i];
		const isRemove = from && !to;

		let delay = 0;
		if (isRemove) delay = ((len - i) / len) * 100 + offsetDelay;
		else {
			const factor = i % 10 ? 1 : 0;
			delay = Math.random() * 1000 * factor + offsetDelay;
		}

		const kill = frames.transition({
			steps: Math.floor(Math.random() * 10) + 1,
			duration: 200,
			delay,
			onUpdate: () => {
				const char = getRandomAsciiChar();
				element.innerText = replaceCharAtIndex(element.innerText, char, index);
			},
			onComplete: () => {
				if (isRemove) element.innerText = element.innerText.substring(0, index);
				else element.innerText = replaceCharAtIndex(element.innerText, to, index);
				++inc;
				if (inc === len - 1) onComplete();
			},
		});
		kills.push(kill);
	}
	return kills;
};

export default animate;
