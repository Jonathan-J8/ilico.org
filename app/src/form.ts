const buttons = document.querySelectorAll('button[data-form]') as NodeListOf<HTMLButtonElement>;
const select = document.querySelector('select') as HTMLSelectElement;
const mail = document.querySelector('input[type="email"]') as HTMLInputElement;

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

	// fetch(form.action, {
	// 	method: form.method,
	// 	body: formData,
	// }).catch((error) => {
	// 	console.error('Error submitting form:', error);
	// 	alert('An error occurred while submitting the form.');
	// });
});
