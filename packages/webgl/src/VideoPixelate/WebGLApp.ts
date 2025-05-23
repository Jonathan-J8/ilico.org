type Uniform = {
	value: any;
	readonly location: WebGLUniformLocation;
	readonly name: string;
};

type Texture = {
	readonly location: WebGLTexture;
	readonly index: number;
	readonly name: string;
	value: HTMLVideoElement | null;
};

const vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform sampler2D u_texture_a;
uniform sampler2D u_texture_b;
uniform float u_blend;
in vec2 v_texCoord;
out vec4 outColor;

void main() {
    vec4 colorA = texture(u_texture_a, v_texCoord);
    vec4 colorB = texture(u_texture_b, v_texCoord);
    outColor = mix(colorA, colorB, u_blend); // blend both textures for demonstration
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
	uniforms: Record<Uniform['name'], Uniform> = {};

	constructor(canvas: HTMLCanvasElement) {
		const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
		if (!gl) throw new Error('[VideoPixelate]: WebGL2RenderingContext not found');
		this.gl = gl;
		this.canvas = canvas;
		const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
		const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

		const program = gl.createProgram()!;
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(program) ?? 'Program linking failed');
		}
		gl.useProgram(program);

		// Quad geometry
		const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
		const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);

		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

		const posLoc = gl.getAttribLocation(program, 'a_position');
		gl.enableVertexAttribArray(posLoc);
		gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

		const texCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

		const texCoordLoc = gl.getAttribLocation(program, 'a_texCoord');
		gl.enableVertexAttribArray(texCoordLoc);
		gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
		gl.useProgram(program);

		{
			const name = 'u_texture_a';
			const index = gl.TEXTURE0;
			const location = gl.createTexture()!;
			gl.activeTexture(index);
			gl.bindTexture(gl.TEXTURE_2D, location);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.uniform1i(gl.getUniformLocation(program, name), 0);
			this.textures[name] = { location, index, name, value: null };
		}
		{
			const name = 'u_texture_b';
			const index = gl.TEXTURE1;
			const location = gl.createTexture()!;
			gl.activeTexture(index);
			gl.bindTexture(gl.TEXTURE_2D, location);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.uniform1i(gl.getUniformLocation(program, name), 1);
			this.textures[name] = { location, index, name, value: null };
		}

		{
			const name = 'u_blend';
			const value = 0.5;
			const location = gl.getUniformLocation(program, name) as WebGLUniformLocation;
			gl.uniform1f(location, value);
			this.uniforms[name] = { location, name, value };
		}
	}

	update = () => {
		// let t = 0;
		const { gl } = this;

		gl.clear(gl.COLOR_BUFFER_BIT);
		// gl.bindVertexArray(vao);
		// t += 0.01;
		// const blend = 0.5 + 0.5 * Math.sin(t); // oscillates from 0 to 1
		// gl.uniform1f(blendLocation, blend);

		for (const key in this.textures) {
			//@ts-ignore
			const uni = this.textures[key];
			if (!uni.value) continue;
			gl.activeTexture(uni.index);
			gl.bindTexture(gl.TEXTURE_2D, uni.location);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, uni.value);
		}
		for (const key in this.uniforms) {
			const uni = this.uniforms[key];
			gl.uniform1f(uni.location, uni.value);
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
