import { initComponents } from './components';
import { initThree } from './three';
import { initUniforms } from './uniforms';

const webgl = ({
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

export default webgl;
