
const vertexShaderSource = `#version 300 es

void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 150.0;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 fragColor;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;


class WebGLApp {
	private readonly canvas: HTMLCanvasElement | null;
	private readonly gl: WebGL2RenderingContext | null;
	private readonly program: any;
	private readonly vertexShader: WebGLShader | null;
	private readonly fragmentShader: WebGLShader | null;


	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		// WebGL
		if (!this.canvas) throw new Error('PixelateImages: no canvas found');
		this.gl = this.canvas.getContext('webgl2');
		if (!this.gl) throw new Error('PixelateImages: problem while loading webgl2 context');
		this.program = this.gl.createProgram();

		this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		if (!this.vertexShader) throw new Error('PixelateImages: no vertex shader found');
		this.gl.shaderSource(this.vertexShader, vertexShaderSource);
		this.gl.compileShader(this.vertexShader);
		this.gl.attachShader(this.program, this.vertexShader);

		this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		if (!this.fragmentShader) throw new Error('PixelateImages: no vertex shader found');
		this.gl.shaderSource(this.fragmentShader, fragmentShaderSource);
		this.gl.compileShader(this.fragmentShader);
		this.gl.attachShader(this.program, this.fragmentShader);

		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			console.log(this.gl.getShaderInfoLog(this.vertexShader));
			console.log(this.gl.getShaderInfoLog(this.fragmentShader));
		}

		this.gl.useProgram(this.program);

		this.gl.drawArrays(this.gl.POINTS, 0, 1);
	}
}

export default WebGLApp;
