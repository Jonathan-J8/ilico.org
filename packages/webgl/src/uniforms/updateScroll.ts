import { Vector2 } from 'three';
import { damp } from 'three/src/math/MathUtils.js';
import uniforms from './uniforms';

const prevScroll = new Vector2();
const vel = new Vector2();

const updateScroll = (e: Event) => {
	const { uScroll, uDeltaTime, uScrollVelocity } = uniforms;
	prevScroll.copy(uScroll.value);
	uScroll.value.x = window.scrollX / (document.body.scrollWidth - window.innerWidth);
	uScroll.value.y = window.scrollY / (document.body.scrollHeight - window.innerHeight);

	if (e.type === 'scroll') vel.subVectors(uScroll.value, prevScroll);
	else vel.set(0, 0);
	const d = uDeltaTime.value;
	uScrollVelocity.value.x = damp(uScrollVelocity.value.x, vel.x, 0.001, d * 1000);
	uScrollVelocity.value.y = damp(uScrollVelocity.value.y, vel.y, 0.001, d * 1000);
};

export default updateScroll;
