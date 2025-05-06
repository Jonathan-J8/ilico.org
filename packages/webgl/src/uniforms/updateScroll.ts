import { Vector2 } from 'three';
import uniforms from './uniforms';

const prevScroll = new Vector2();

const updateScroll = (e: Event) => {
	const { uScroll, uScrollVelocity } = uniforms;
	prevScroll.copy(uScroll.value);
	uScroll.value.x = window.scrollX / (document.body.scrollWidth - window.innerWidth);
	uScroll.value.y = window.scrollY / (document.body.scrollHeight - window.innerHeight);

	if (e.type === 'scroll') uScrollVelocity.value.subVectors(uScroll.value, prevScroll);
	else uScrollVelocity.value.set(0, 0);
};

export default updateScroll;
