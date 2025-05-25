import frames from '../frames';
import type ScrambleText from './ScrambleText';
import { getRandomAsciiChar, prepareAnimation } from './utils';

const animate = ({
	element,
	text,
	onComplete,
}: {
	element: ScrambleText;
	text: string;
	onComplete: () => void;
}) => {
	const animation = prepareAnimation(element, text);
	const kills = [];
	const offsetDelay = element.delay;
	let current = element.innerText.split('');
	let inc = 0;

	for (let i = 0, len = animation.length; i < len; ++i) {
		const { from, to, index, delay, steps, duration } = animation[i];
		const charToRemove = from && !to;
		const newDelay = delay + offsetDelay;

		const kill = frames.animation({
			steps,
			duration,
			delay: newDelay,
			onUpdate: () => {
				const char = getRandomAsciiChar();
				current[index] = char;
				element.innerText = current.join('');
			},
			onComplete: () => {
				if (charToRemove) current.pop();
				else current[index] = to;
				element.innerText = current.join('');

				if (++inc === len) onComplete();
			},
		});
		kills.push(kill);
	}
	return kills;
};

export default animate;
