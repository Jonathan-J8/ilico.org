import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import type { GlobalUniforms } from '../uniforms';

const createBloomFx = ({ uniforms }: { uniforms: GlobalUniforms }) => {
	const { uResolution } = uniforms;

	const params = {
		strength: 0.5,
		radius: 0.0001,
		threshold: 1,
	};
	const fx = new UnrealBloomPass(
		uResolution.value,
		params.strength,
		params.radius,
		params.threshold
	);

	return {
		get fx() {
			return fx;
		},

		get params() {
			return params;
		},

		update: () => {
			fx.strength = params.strength;
			fx.radius = params.radius;
			fx.threshold = params.threshold;
		},
	};
};

export default createBloomFx;
