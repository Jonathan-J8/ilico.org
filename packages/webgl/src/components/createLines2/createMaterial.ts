import { CubeTexture, FrontSide, MeshStandardMaterial } from 'three';

import type { GlobalUniforms } from '../../uniforms';
import frag_include from './frag_include.glsl';
import frag_main from './frag_main.glsl';
import vert_include from './vert_include.glsl';
import vert_main from './vert_main.glsl';

type Props = {
	uniforms: GlobalUniforms;
	envMap: CubeTexture;
};

const createMaterial = ({ uniforms, envMap }: Props) => {
	const material = new MeshStandardMaterial({
		side: FrontSide,
		envMap,
		envMapIntensity: 1,
		// envMapRotation: new Euler(Math.PI, 1, 0),
		transparent: true,
		// color: 0x000000,
		metalness: 1,
		roughness: 0.2,
		opacity: 1,
		fog: true,
		// wireframe: true,
	});
	material.customProgramCacheKey = () => `CustomStandardLines2`;

	material.onBeforeCompile = (shader) => {
		shader.uniforms = { ...uniforms, ...shader.uniforms };

		shader.vertexShader = shader.vertexShader.replace(
			'#include <common>',
			`${vert_include}
      #include <common>`
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <project_vertex>',
			`${vert_main}`
		);

		shader.fragmentShader = shader.fragmentShader.replace(
			'#include <common>',
			`${frag_include}
      #include <common>`
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			'#include <opaque_fragment>',
			`${frag_main}`
		);
		// shader.fragmentShader = shader.fragmentShader.replace(
		//   "#include <opaque_fragment>",
		//   ` ${frag_main}
		//   #include <opaque_fragment>`,
		// );
	};

	return material;
};

export default createMaterial;

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
