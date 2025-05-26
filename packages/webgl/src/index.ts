import { initComponents } from './components';
import { initThree } from './three';
import { initUniforms } from './uniforms';
export { frames } from './three';

export const initWebglApp = ({
	canvas,
	debug,
	controls,
}: {
	canvas: HTMLCanvasElement;
	debug: boolean;
	controls: boolean;
}) => {
	const disposeThree = initThree({ debug, canvas, controls });
	const disposeUni = initUniforms();
	initComponents({ debug, canvas });

	return () => {
		disposeThree();
		disposeUni();
	};
};
