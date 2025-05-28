import {
	Camera,
	NoToneMapping,
	PerspectiveCamera,
	WebGLRenderer,
	type Scene,
	type ToneMapping,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import type { Pass } from 'three/addons/postprocessing/Pass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

// https://stackoverflow.com/questions/75172794/how-can-i-see-the-whole-shaders-text-content-with-all-the-prepended-code-by-th
const onShaderError = function (
	gl: WebGLRenderingContext,
	_program: WebGLProgram,
	vs: WebGLShader,
	fs: WebGLShader
) {
	const parseForErrors = function (gl: WebGLRenderingContext, shader: WebGLShader, name: string) {
		const errors = gl.getShaderInfoLog(shader)?.trim();
		const prefix = 'Errors in ' + name + ':' + '\n\n' + errors;

		if (errors !== '') {
			const code = gl.getShaderSource(shader)?.replace(/\t/g, '  ');
			const lines = code?.split('\n');
			let linedCode = '';
			let i = 1;
			if (!lines) return;
			for (const line of lines) {
				linedCode += (i < 10 ? ' ' : '') + i + ':\t\t' + line + '\n';
				i++;
			}

			console.error(prefix + '\n' + linedCode);
		}
	};

	parseForErrors(gl, vs, 'Vertex Shader');
	parseForErrors(gl, fs, 'Fragment Shader');
};

class Renderer {
	instance: WebGLRenderer | undefined;
	composer: EffectComposer | undefined;
	// #toneMapping: ToneMapping = ReinhardToneMapping;
	// #toneMappingExposure = 1;

	set toneMapping(t: ToneMapping) {
		if (!this.instance) return;
		this.instance.toneMapping = t;
	}
	get toneMapping() {
		return this.instance?.toneMapping || NoToneMapping;
	}
	set toneMappingExposure(t: number) {
		if (!this.instance) return;
		this.instance.toneMappingExposure = t;
	}
	get toneMappingExposure() {
		return this.instance?.toneMappingExposure || 1;
	}

	init = (
		canvas: HTMLCanvasElement | OffscreenCanvas,
		debug?: boolean,
		_browserName?: string
	) => {
		if (this.instance) {
			console.warn('Renderer already initialized');
			return;
		}

		this.instance = new WebGLRenderer({
			canvas,
			alpha: true,
			premultipliedAlpha: false,
			antialias: true,
			powerPreference: 'default',
			failIfMajorPerformanceCaveat: false,
			// preserveDrawingBuffer: true,
		});
		// this.instance.autoClear = false;
		// this.instance.autoClearDepth = false;

		if (debug) {
			this.instance.debug.onShaderError = onShaderError;
			this.instance.debug.checkShaderErrors = true;
		} else {
			this.instance.debug.checkShaderErrors = false;
		}
	};

	initComposer = (scene: Scene, camera: PerspectiveCamera) => {
		if (this.composer) {
			console.warn('Composer already initialized');
			return;
		}
		if (!this.instance) return;

		const renderPass = new RenderPass(scene, camera);
		this.composer = new EffectComposer(this.instance);
		this.composer.addPass(renderPass);
	};

	update = (scene: Scene, camera: Camera, delta = 0.16) => {
		if (!this.instance) return;

		if (this.composer) this.composer.render(delta);
		else this.instance.render(scene, camera);
	};

	resize = (o: { width: number; height: number; pixelRatio: number }) => {
		const { width, height, pixelRatio } = o;
		if (!this.instance) return;
		this.instance.setSize(width, height, false);
		this.instance.setPixelRatio(pixelRatio);
		if (this.composer) this.composer.setSize(width, height);
	};

	dispose = () => {
		if (this.instance) {
			this.instance.dispose();
		}
		if (this.composer) {
			this.composer.passes.forEach((p) => {
				p.dispose();
				this.composer?.removePass(p);
			});
			this.composer.dispose();
		}
	};

	addEffect = (pass: Pass) => {
		if (!this.composer || !this.instance) return;
		this.composer.addPass(pass);
	};

	removeEffect = (...pass: Pass[]) => {
		pass.forEach((p) => {
			this.composer?.removePass(p);
		});
	};
}

export default Renderer;
