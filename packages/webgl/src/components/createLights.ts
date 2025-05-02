import { AmbientLight, DirectionalLight } from 'three';

const createLights = () => {
	const ambient = new AmbientLight(0xffffff);
	// hemisphere = new HemisphereLight(0x0000ff, 0x0000ff, this.#intensity * 50);
	const directional = new DirectionalLight(0xc5d1ff);

	return {
		get meshes() {
			return [ambient, directional];
		},

		dispose: () => {
			ambient.dispose();
			directional.dispose();
		},
	};
};

export default createLights;
