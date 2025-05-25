import { VideoPixelate, type ScrambleText } from 'pkg-components';
import headerTexts from './texts.json';

let observer: IntersectionObserver | undefined;

const animateHeader = () => {
	let inc = 1;
	let id: undefined | ReturnType<typeof setInterval>;

	const h2Top = document.getElementById('js-header-top') as ScrambleText;
	const h2Bottom = document.getElementById('js-header-bottom') as ScrambleText;
	const h2Video = document.getElementById('js-header-video') as VideoPixelate;

	const anim = async () => {
		const { value, question } = headerTexts[inc];

		h2Top.delay = 0;
		h2Bottom.delay = 300;

		h2Top.setAttribute('value', value);
		h2Bottom.setAttribute('value', question);
		h2Video.setAttribute('videoIndex', `${inc}`);

		++inc;
		inc = inc % headerTexts.length;
	};

	if (observer) return; // preventing hot-reload cleaning

	const h2 = document.getElementById('js-h2') as HTMLElement;
	observer = new IntersectionObserver(
		(entries) => {
			const { intersectionRatio } = entries[0];
			if (intersectionRatio === 0) {
				if (typeof id === 'number') clearInterval(id);
			} else {
				// anim();
				id = setInterval(anim, 6000);
			}
		},
		{ threshold: 0 }
	);

	observer.observe(h2);
};

export default animateHeader;
