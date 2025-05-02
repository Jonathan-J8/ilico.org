import { CubeTexture, InstancedMesh } from 'three';

import createGeometry from './createGeometry';
import createMaterial from './createMaterial';

type Props = {
	index: number;
	uniforms: Parameters<typeof createMaterial>[0]['uniforms'];
	envMap: CubeTexture;
	count: number;
	width: number;
	height: number;
};

const createLines = ({ index = 0, uniforms, envMap, count, width = 1, height = 1 }: Props) => {
	const material = createMaterial({ uniforms, envMap });
	const geometry = createGeometry({ count, width, height });
	const mesh = new InstancedMesh(geometry, material, count);

	mesh.name = `lines${index}`;
	return {
		mesh,

		dispose: () => {
			material.dispose();
			geometry.dispose();
		},
	};
};

export default createLines;
// const material = new ShaderMaterial({
//   glslVersion: GLSL3,
//   side: DoubleSide,
//   transparent: true,
//   // wireframe: true,
//   vertexShader,
//   fragmentShader,

//   uniforms: {
//     // count: { value: COUNT },
//     // scrollY: { value: 0 },
//     ...uniforms,
//     uMousePositionLerp: { value: new Vector3() },
//     uMouseVelocityLerp: { value: new Vector2() },
//     displacementMap: { value: null },
//   },
// });
