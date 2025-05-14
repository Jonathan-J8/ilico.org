import frames from '../frames';
import ScrambleText from '../ScrambleText/ScrambleText';
import headerTexts from './texts.json';

const animateHeader = () => {
	let inc = 0;
	let id: undefined | ReturnType<typeof setInterval>;

	const h2 = document.getElementById('js-h2') as HTMLElement;
	const h2Top = document.getElementById('js-h2-top') as ScrambleText;
	const h2Bottom = document.getElementById('js-h2-bottom') as ScrambleText;

	const anim = async () => {
		const { value, question } = headerTexts[inc];

		h2.ariaLabel = `${value} ${question}`;
		h2Top.setAttribute('value', value);
		await frames.wait(500);
		h2Bottom.setAttribute('value', question);

		++inc;
		inc = inc % headerTexts.length;
	};

	const observer = new IntersectionObserver(
		(entries) => {
			const { intersectionRatio } = entries[0];
			if (intersectionRatio === 0) {
				if (typeof id === 'number') clearInterval(id);
			} else {
				anim();
				id = setInterval(anim, 6000);
			}
		},
		{ threshold: 0 }
	);

	observer.observe(h2);
};

export default animateHeader;
