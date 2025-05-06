import { frames } from '../three';
import onFramesUpdate from './onFramesUpdate';
import updateMousePosition from './updateMousePosition';
import updateMousePress from './updateMousePress';
import updateMouseVelocity from './updateMouseVelocity';
import updateMouseWorldPosition from './updateMouseWorldPosition';
import updateScroll from './updateScroll';
import updateTime from './updateTime';

const initGlobalUniforms = () => {
	frames.add(updateTime, onFramesUpdate.update);

	const pointermove = (e: PointerEvent) => {
		onFramesUpdate.reset();
		updateMousePosition(e);
		updateMouseWorldPosition();
		updateMouseVelocity(e);
	};

	window.addEventListener('pointermove', pointermove, false);
	window.addEventListener('pointerdown', updateMousePress, false);
	window.addEventListener('pointerup', updateMousePress, false);
	window.addEventListener('pointerout', updateMousePress, false);
	window.addEventListener('scroll', updateScroll, false);
	window.addEventListener('scrollend', updateScroll, false);

	const dispose = () => {
		frames.remove(updateTime, onFramesUpdate.update);
		window.removeEventListener('pointermove', pointermove, false);
		window.removeEventListener('pointerdown', updateMousePress, false);
		window.removeEventListener('pointerup', updateMousePress, false);
		window.removeEventListener('pointerout', updateMousePress, false);
		window.removeEventListener('scroll', updateScroll, false);
		window.removeEventListener('scrollend', updateScroll, false);
	};

	return dispose;
};

export default initGlobalUniforms;
