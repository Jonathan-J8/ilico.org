import { Vector2 } from 'three';
import uniforms from './uniforms';

const prevScroll = new Vector2();

const updateScroll = (e: Event) => {
	const { uScroll, uScrollVelocity } = uniforms;
	prevScroll.copy(uScroll.value);
	const x = window.scrollX / (document.body.scrollWidth - window.innerWidth);
	const y = window.scrollY / (document.body.scrollHeight - window.innerHeight);

	uScroll.value.x = x; // damp2(uScroll.value.x, x, 0.001, uDeltaTime.value);
	uScroll.value.y = y; // damp2(uScroll.value.y, y, 0.001, uDeltaTime.value);

	if (e.type === 'scroll') uScrollVelocity.value.subVectors(uScroll.value, prevScroll);
	else uScrollVelocity.value.set(0, 0);
};

export default updateScroll;
