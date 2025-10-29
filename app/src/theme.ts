document.querySelector('#theme-controller > input')?.addEventListener('change', (e) => {
	const { checked } = e.target as HTMLInputElement;
	const theme = checked ? 'dark' : 'light';
	document.documentElement.setAttribute('data-theme', theme);
});
