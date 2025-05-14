export const getRandomAsciiChar = () => {
	const min = 32; // space
	const max = 126; // tilde (~)
	const code = Math.floor(Math.random() * (max - min + 1)) + min;
	return String.fromCharCode(code);
};

export const replaceCharAtIndex = (str: string, char: string, index: number) => {
	return str.substring(0, index) + char + str.substring(index + 1);
};

export const prepareText = (el: HTMLElement, text: string) => {
	const arr = el.innerText.split('');
	const nextArr = text.split('');
	const len = arr.length > nextArr.length ? arr.length : nextArr.length;
	const animations = [];

	for (let index = 0; index < len; index++) {
		const from = arr[index];
		const to = nextArr[index];

		if (from === to) continue; // do nothing
		if (from && to === ' ') {
			// replace char to space immediatly
			el.innerText = replaceCharAtIndex(el.innerText, ' ', index);
			continue;
		}

		if (!from && to) el.innerText += ' '; // add space immediatly

		animations.push({ index, from, to }); // save the future replacement
	}

	return animations;
};
