import { DoubleSide, Mesh, MeshLambertMaterial, PlaneGeometry, Texture } from 'three';

const debugTexture = (textureCallback: () => Texture | null) => {
	//   const defaultVec3 = { x: 0, y: 0, z: 0 };

	const mesh = new Mesh(
		new PlaneGeometry(2, 2),

		// new ShaderMaterial({
		//   glslVersion: GLSL3,
		//   side: DoubleSide,
		//   transparent: false,
		//   uniforms: {
		//     map: { value: textureCallback() },
		//   },
		//   vertexShader: `
		// varying vec2 vUv;
		// void main() {
		//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		//   vUv = uv;
		// }`,

		//   fragmentShader: `
		// varying vec2 vUv;
		// uniform sampler2D map;
		// out vec4 FragColor;
		// void main() {
		//   FragColor = texture2D( map, vUv );
		// }`,
		// }),
		new MeshLambertMaterial({
			map: textureCallback(),
			side: DoubleSide,
			color: 0xffffff,
			transparent: false,
		})
	);

	const update = () => {
		mesh.material.map = textureCallback();
		// mesh.material.uniforms.map.value = textureCallback();
		// mesh.material.uniforms.map.value.needsUpdate = true;
	};

	const dispose = () => {
		mesh.geometry.dispose();
		mesh.material.dispose();
	};

	return { mesh, update, dispose };
};

export default debugTexture;
