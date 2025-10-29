import { MonoEventEmitter } from 'joeat-utils';
import { debugWebGL, testShaders } from './debug';
import fragmentShaderSource from './prgm_frag.glsl';
import vertexShaderSource from './prgm_vert.glsl';

type Texture = {
	readonly location: WebGLTexture;
	readonly index: number;
	readonly name: string;
	value: HTMLVideoElement | null;
};

const compileShader = (gl: WebGL2RenderingContext, source: string, type: number): WebGLShader => {
	const shader = gl.createShader(type);
	if (!shader) {
		throw new Error(`Failed to create shader of type ${type}`);
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(`Shader compilation failed: ${info}`);
	}
	return shader;
};

class WebGLApp {
	gl: WebGL2RenderingContext;
	canvas: HTMLCanvasElement;
	private bin = new MonoEventEmitter<[]>();
	private textures: Record<Texture['name'], Texture> = {};
	uniforms = {
		//@ts-ignore
		textureA: (v: HTMLVideoElement) => {},
		//@ts-ignore
		textureB: (v: HTMLVideoElement) => {},
		//@ts-ignore
		resolution: (x: number, y: number) => {},
		//@ts-ignore
		blend: (v: number) => {},
		//@ts-ignore
		pixelSize: (v: number) => {},
		//@ts-ignore
		mousePosition: (x: number, y: number) => {},
		//@ts-ignore
		mouseVelocity: (x: number, y: number) => {},
	};

	contextLost = (e: Event) => {
		console.warn('WebGLApp: context lost', e);
		this.bin.clear();
	};

	constructor(canvas: HTMLCanvasElement) {
		let gl = canvas.getContext('webgl2', {
			preserveDrawingBuffer: false,
			antialias: false,
			alpha: true,
			premultipliedAlpha: true,
		}) as WebGL2RenderingContext;

		if (!gl) {
			gl = canvas.getContext('webgl', {
				preserveDrawingBuffer: false,
				antialias: false,
				alpha: true,
				premultipliedAlpha: true,
			}) as WebGL2RenderingContext;
		}

		canvas.addEventListener('webglcontextlost', this.contextLost, false);
		this.bin.addListener(() => {
			canvas.removeEventListener('webglcontextlost', this.contextLost, false);
		});

		if (!gl) throw new Error('WebGLApp: WebGL context not available');

		if (import.meta.env.DEV) {
			debugWebGL(canvas);
			testShaders(gl);
		}

		// Check for required extensions
		if (!gl.getExtension('OES_texture_float_linear')) {
			console.warn('OES_texture_float_linear not available');
		}

		this.gl = gl;
		this.canvas = canvas;

		const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
		const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

		const program = gl.createProgram();
		if (!program) {
			throw new Error('Failed to create WebGL program');
		}

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(program);
			gl.deleteProgram(program);
			throw new Error(`WebGLApp: Program linking failed: ${info}`);
		}

		gl.useProgram(program);

		// Create and bind VAO (Vertex Array Object) - may not be available in WebGL1
		let vao: WebGLVertexArrayObject | null = null;
		if (gl.createVertexArray) {
			vao = gl.createVertexArray();
			gl.bindVertexArray(vao);
		}

		this.bin.addListener(() => {
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			gl.deleteProgram(program);
		});

		// Quad geometry
		{
			const datas = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
			const buffer = gl.createBuffer();
			if (!buffer) throw new Error('Failed to create position buffer');

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW);
			const location = gl.getAttribLocation(program, 'position');

			if (location >= 0) {
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
			}

			this.bin.addListener(() => {
				if (buffer) gl.deleteBuffer(buffer);
			});
		}

		{
			const datas = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);
			const buffer = gl.createBuffer();
			if (!buffer) throw new Error('Failed to create UV buffer');

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW);
			const location = gl.getAttribLocation(program, 'uv');

			if (location >= 0) {
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
			}

			this.bin.addListener(() => {
				if (buffer) gl.deleteBuffer(buffer);
			});
		}

		// Textures
		{
			const name = 'textureA';
			const index = gl.TEXTURE0;
			const location = gl.createTexture();
			if (!location) throw new Error(`Failed to create ${name}`);

			gl.activeTexture(index);
			gl.bindTexture(gl.TEXTURE_2D, location);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

			const uniformLocation = gl.getUniformLocation(program, name);
			if (uniformLocation) {
				gl.uniform1i(uniformLocation, 0);
			}

			this.textures[name] = { location, index, name, value: null };
			this.uniforms[name] = (v) => (this.textures[name].value = v);
			this.bin.addListener(() => {
				if (location) gl.deleteTexture(location);
			});
		}
		{
			const name = 'textureB';
			const index = gl.TEXTURE1;
			const location = gl.createTexture();
			if (!location) throw new Error(`Failed to create ${name}`);

			gl.activeTexture(index);
			gl.bindTexture(gl.TEXTURE_2D, location);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

			const uniformLocation = gl.getUniformLocation(program, name);
			if (uniformLocation) {
				gl.uniform1i(uniformLocation, 1);
			}

			this.textures[name] = { location, index, name, value: null };
			this.uniforms[name] = (v) => (this.textures[name].value = v);
			this.bin.addListener(() => {
				if (location) gl.deleteTexture(location);
			});
		}

		// Uniforms
		{
			const name = 'resolution';
			const location = gl.getUniformLocation(program, name);
			if (!location) console.warn(`WebGLApp: uniform ${name} not used`);
			this.uniforms[name] = (...value) => {
				gl.uniform2f(location, ...value);
			};
			this.uniforms[name](1000 / (9 / 16), 1000);
		}
		{
			const name = 'pixelSize';
			const location = gl.getUniformLocation(program, name);
			if (!location) console.warn(`WebGLApp: uniform ${name} not used`);
			this.uniforms[name] = (value) => gl.uniform1f(location, value);
			this.uniforms[name](0.1);
		}
		{
			const name = 'blend';
			const location = gl.getUniformLocation(program, name);
			if (!location) console.warn(`WebGLApp: uniform ${name} not used`);
			this.uniforms[name] = (value) => gl.uniform1f(location, value);
			this.uniforms[name](0);
		}
		{
			const name = 'mousePosition';
			const location = gl.getUniformLocation(program, name);
			if (!location) console.warn(`WebGLApp: uniform ${name} not used`);
			this.uniforms[name] = (...value) => gl.uniform2f(location, ...value);
			this.uniforms[name](0, 0);
		}
		{
			const name = 'mouseVelocity';
			const location = gl.getUniformLocation(program, name);
			if (!location) console.warn(`WebGLApp: uniform ${name} not used`);
			this.uniforms[name] = (...value) => gl.uniform2f(location, ...value);
			this.uniforms[name](0, 0);
		}
	}

	private checkGLError(operation: string) {
		const { gl } = this;
		const error = gl.getError();
		if (error !== gl.NO_ERROR) {
			console.error(`WebGL error after ${operation}: ${error}`);
			return false;
		}
		return true;
	}

	update = () => {
		const { gl } = this;
		if (gl.isContextLost()) return console.warn('WebGL context is lost');
		gl.clear(gl.COLOR_BUFFER_BIT);

		try {
			for (const key in this.textures) {
				const uni = this.textures[key];
				if (!uni.value) continue;

				// Check if video is ready
				if (uni.value.readyState < 2) continue;

				gl.activeTexture(uni.index);
				gl.bindTexture(gl.TEXTURE_2D, uni.location);

				// Use try-catch for texImage2D as it can fail with video elements
				try {
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, uni.value);
				} catch (e) {
					console.warn(`Failed to update texture ${key}:`, e);
					continue;
				}
			}

			gl.drawArrays(gl.TRIANGLES, 0, 6);
			this.checkGLError('draw');
		} catch (error) {
			console.error('Error in WebGL update:', error);
		}
	};

	resize = (width = 250, height = 250) => {
		const { gl, canvas } = this;
		// Set the canvas drawing buffer size
		canvas.width = width;
		canvas.height = height;

		// Optional: Set CSS size (to match drawing buffer size)
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		// Update WebGL viewport
		gl.viewport(0, 0, width, height);
	};

	dispose = () => {
		this.bin.clear();
	};
}

export default WebGLApp;
