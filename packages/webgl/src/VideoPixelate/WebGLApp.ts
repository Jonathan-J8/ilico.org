type Texture = {
	readonly location: WebGLTexture;
	readonly index: number;
	readonly name: string;
	value: HTMLVideoElement | null;
};

const vertexShaderSource = /*glsl*/ `#version 300 es
in vec2 position; in vec2 uv; out vec2 v_uv;
void main() { gl_Position = vec4(position, 0, 1); v_uv = uv;}`;

const fragmentShaderSource = /*glsl*/ `#version 300 es
precision lowp float;

uniform sampler2D textureA;
uniform sampler2D textureB;
uniform vec2 resolution;
uniform float pixelSize;
uniform float blend;

in vec2 v_uv;
out vec4 outColor;

void main() {

	vec2 uv = v_uv  * resolution;

	// Shift origin to center before flooring
	vec2 centered = uv - 0.5 * resolution;
	centered = floor(centered / pixelSize) * pixelSize + 0.5 * pixelSize;

	// Shift back
	uv = ( centered + 0.5 * resolution ) / resolution;
    vec4 colorA = texture(textureA, uv);
    vec4 colorB = texture(textureB, uv);

    outColor = mix(colorA, colorB, blend);
}
`;

const compileShader = (gl: WebGL2RenderingContext, source: string, type: number): WebGLShader => {
	const shader = gl.createShader(type)!;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compilation failed');
	}
	return shader;
};

class WebGLApp {
	gl: WebGL2RenderingContext;
	canvas: HTMLCanvasElement;
	textures: Record<Texture['name'], Texture> = {};

	uniforms = {
		textureA: (v: HTMLVideoElement) => {},
		textureB: (v: HTMLVideoElement) => {},
		resolution: (x: number, y: number) => {},
		blend: (v: number) => {},
		pixelSize: (v: number) => {},
	};

	constructor(canvas: HTMLCanvasElement) {
		const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
		if (!gl) throw new Error('WebGLApp: WebGL2RenderingContext not found');
		this.gl = gl;
		this.canvas = canvas;

		const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
		const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
		const program = gl.createProgram()!;
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error(
				`WebGLApp: ${gl.getProgramInfoLog(program) ?? 'Program linking failed'}`
			);
		}
		gl.useProgram(program);
		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);

		// Quad geometry
		{
			const datas = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW);
			const location = gl.getAttribLocation(program, 'position');
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
		}

		{
			const datas = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW);
			const location = gl.getAttribLocation(program, 'uv');
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
		}

		{
			const name = 'textureA';
			const index = gl.TEXTURE0;
			const location = gl.createTexture()!;
			gl.activeTexture(index);
			gl.bindTexture(gl.TEXTURE_2D, location);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.uniform1i(gl.getUniformLocation(program, name), 0);
			this.textures[name] = { location, index, name, value: null };
			this.uniforms[name] = (v) => (this.textures[name].value = v);
		}
		{
			const name = 'textureB';
			const index = gl.TEXTURE1;
			const location = gl.createTexture()!;
			gl.activeTexture(index);
			gl.bindTexture(gl.TEXTURE_2D, location);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.uniform1i(gl.getUniformLocation(program, name), 1);
			this.textures[name] = { location, index, name, value: null };
			this.uniforms[name] = (v) => (this.textures[name].value = v);
		}

		{
			const name = 'resolution';
			const location = gl.getUniformLocation(program, name);
			if (!location) console.warn(`WebGLApp: uniform ${name} not used`);
			this.uniforms[name] = (...value) => {
				gl.uniform2f(location, ...value);
			};
			this.uniforms[name](200, 200);
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
	}

	update = () => {
		const { gl } = this;

		gl.clear(gl.COLOR_BUFFER_BIT);

		for (const key in this.textures) {
			const uni = this.textures[key];
			if (!uni.value) continue;
			gl.activeTexture(uni.index);
			gl.bindTexture(gl.TEXTURE_2D, uni.location);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, uni.value);
		}

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	};

	resize = (width = 250, height = 250) => {
		const { gl, canvas } = this;
		// Set the canvas drawing buffer size
		canvas.width = width;
		canvas.height = height;

		// Optional: Set CSS size (to match drawing buffer size)
		// canvas.style.width = `${width}px`;
		// canvas.style.height = `${height}px`;

		// Update WebGL viewport
		gl.viewport(0, 0, width, height);
	};
}

export default WebGLApp;
