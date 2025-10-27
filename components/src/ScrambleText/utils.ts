export const getRandomAsciiChar = () => {
	const min = 32; // space
	const max = 126; // tilde (~)
	const code = Math.floor(Math.random() * (max - min + 1)) + min;
	return String.fromCharCode(code);
};

export const replaceCharAtIndex = (str: string, char: string, index: number) => {
	return str.substring(0, index) + char + str.substring(index + 1);
};

export const prepareAnimation = (el: HTMLElement, text: string) => {
	const arr = el.innerText.split('');
	const nextArr = text.split('');
	const isNextBigger = arr.length < nextArr.length;
	const len = isNextBigger ? nextArr.length : arr.length;
	const factor = 1000;
	const animations = [];

	for (let index = 0; index < len; index++) {
		let from = arr[index];
		let to = nextArr[index];

		// do nothing
		if (from === to) continue;

		let delay = isNextBigger
			? (index / len + 0.1) * factor
			: ((len - index) / len + 0.1) * factor;
		let steps = 8;
		let duration = 10;

		if (to === ' ' || !to) {
			delay *= 0.8;
			steps *= 0.8;
			duration *= 0.8;
		}

		animations.push({ index, from, to, delay, duration, steps });
	}

	return animations;
};
