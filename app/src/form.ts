const buttons = document.querySelectorAll('button[data-form]') as NodeListOf<HTMLButtonElement>;
const select = document.querySelector('select') as HTMLSelectElement;
const mail = document.querySelector('input[type="email"]') as HTMLInputElement;
const output = document.querySelector('p[data-form="output"]') as HTMLParagraphElement;

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		const formId = button.getAttribute('data-form');
		select.selectedIndex = parseInt(formId || '0', 10);
	});
});

const form = document.querySelector('form') as HTMLFormElement;

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = new FormData(form);
	formData.append('offre', select.value);
	formData.append('email', mail.value);

	fetch(form.action, {
		method: form.method,
		body: formData,
	})
		.then((response) => {
			if (!response.ok) throw new Error('Network response was not ok');
			return response.text();
		})
		.then((text) => {
			output.style.color = 'inherit';
			output.textContent = text;
		})
		.catch((error) => {
			output.style.color = 'red';
			output.textContent = 'Erreur de soumission du formulaire : ' + error?.message || '';
		});
});
