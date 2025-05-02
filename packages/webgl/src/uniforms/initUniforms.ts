import { frames } from '../three';
import mouseLerp from './mouseLerp';
import updateMousePosition from './updateMousePosition';
import updateMousePress from './updateMousePress';
import updateMouseVelocity from './updateMouseVelocity';
import updateMouseVelocityLerp from './updateMouseVelocityLerp';
import updateMouseWorldPosition from './updateMouseWorldPosition';
import updateScroll from './updateScroll';
import updateTime from './updateTime';

const initGlobalUniforms = () => {
	frames.add(mouseLerp.update);
	frames.add(updateTime);
	const pointermove = (e: PointerEvent) => {
		mouseLerp.reset();
		updateMouseVelocity(e);
		updateMouseVelocityLerp();
		updateMousePosition(e);
		updateMouseWorldPosition();
	};

	window.addEventListener('pointermove', pointermove, false);
	window.addEventListener('pointerdown', updateMousePress, false);
	window.addEventListener('pointerup', updateMousePress, false);
	window.addEventListener('pointerout', updateMousePress, false);
	window.addEventListener('scroll', updateScroll, false);

	const dispose = () => {
		frames.remove(mouseLerp.update, updateTime);
		window.removeEventListener('pointermove', pointermove, false);
		window.removeEventListener('pointerdown', updateMousePress, false);
		window.removeEventListener('pointerup', updateMousePress, false);
		window.removeEventListener('pointerout', updateMousePress, false);
		window.removeEventListener('scroll', updateScroll, false);
	};

	return dispose;
};

export default initGlobalUniforms;
