import { CubeTexture, DoubleSide, MeshStandardMaterial } from 'three';

import type { GlobalUniforms } from '../../uniforms';
import frag_include from './frag_include.glsl';
import frag_main from './frag_main.glsl';
import vert_include from './vert_include.glsl';
import vert_main from './vert_main.glsl';

type Props = {
	uniforms: GlobalUniforms;
	envMap: CubeTexture;
	count: number;
	height: number;
};

const createMaterial = ({ uniforms, envMap, count, height }: Props) => {
	const material = new MeshStandardMaterial({
		side: DoubleSide,
		envMap,
		envMapIntensity: 1,
		// envMapRotation: new Euler(Math.PI, 1, 0),
		transparent: true,
		metalness: 1,
		roughness: 0.07,
		opacity: 1,
		fog: true,
		defines: {
			COUNT: count,
			HEIGHT: height,
		},
		// color: 0x000000,
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
