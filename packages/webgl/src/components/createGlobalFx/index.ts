import { GLSL3, ShaderMaterial, Texture } from 'three';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { GlobalUniforms } from '../../uniforms';
import vertexShader from '../../utils/fxVertexShader.glsl';
import fragmentShader from './frag.glsl';

const createGlobalFx = ({ uniforms }: { uniforms: GlobalUniforms }) => {
	const material = new ShaderMaterial({
		glslVersion: GLSL3,
		transparent: true,
		uniforms: {
			...uniforms,
			map0: { value: null },
			tDiffuse: { value: null },
		},
		vertexShader,
		fragmentShader,
	});

	const fx = new ShaderPass(material);
	return {
		fx,

		set map0(t: Texture) {
			material.uniforms.map0.value = t;
		},
		dispose: () => {
			material.uniforms.tDiffuse.value?.dispose();
			material.uniforms.map0.value?.dispose();
			material.dispose();
		},
	};
};

export default createGlobalFx;
