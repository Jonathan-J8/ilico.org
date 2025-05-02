import { type WebGLRenderer } from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import fragmentShader from './frag.glsl';

const createMouseGpu = (props: {
	renderer: WebGLRenderer;

	uniforms: any;
}) => {
	const { renderer, uniforms } = props;
	const gpgpu = new GPUComputationRenderer(128, 128, renderer);
	const texture = gpgpu.createTexture();
	// texture.wrapS = RepeatWrapping;
	// texture.wrapT = RepeatWrapping;

	const variable = gpgpu.addVariable('map', fragmentShader, texture);

	gpgpu.setVariableDependencies(variable, [variable]);

	variable.material.uniforms = { ...uniforms };

	const error = gpgpu.init();
	if (error !== null) console.error(error);

	const update = () => {
		gpgpu.compute();
	};
	const dispose = () => {
		gpgpu.dispose();
		variable.material.dispose();
		variable.material.uniforms.map.value.dispose();
		texture.dispose();
	};

	return {
		get params() {
			const { size, deep } = variable.material.uniforms;
			return { size, deep };
		},

		get texture() {
			return gpgpu.getCurrentRenderTarget(variable).texture || undefined;
		},
		update,
		dispose,
	};
};

export default createMouseGpu;
