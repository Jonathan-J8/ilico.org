import { initComponents } from './components';
import { initThree } from './three';
import { initUniforms } from './uniforms';

const webgl = ({ canvas, debug }: { canvas: HTMLCanvasElement; debug: boolean }) => {
	const disposeThree = initThree({ debug, canvas, controls: false });
	const disposeUni = initUniforms();
	initComponents({ debug, canvas });

	return () => {
		disposeThree();
		disposeUni();
	};
};

export default webgl;
