// Setup shader programs
const vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
}
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_texture;
    varying vec2 v_texCoord;
    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
     }
`;

function compileShader(gl: WebGLRenderingContext, source: string, type: number) {
	const shader = gl.createShader(type);
	if (!shader) throw new Error('[VideoPixelate]: WebglShader not created');
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	return shader;
}

const renderer = ({ canvas, video }: { canvas: HTMLCanvasElement; video: HTMLVideoElement }) => {
	const gl = canvas.getContext('webgl');
	if (!gl) throw new Error('[VideoPixelate]: WebGLRenderingContext not found');

	const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
	const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
	if (!vertexShader || !fragmentShader)
		throw new Error('[VideoPixelate]: WebglShader not compiled');

	// Link program
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	// Quad positions (2 triangles)
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	const texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);
	gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

	// Lookup attribute locations
	const positionLocation = gl.getAttribLocation(program, 'a_position');
	gl.enableVertexAttribArray(positionLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
	gl.enableVertexAttribArray(texCoordLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	// Setup texture
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	// Load and update video texture

	const render = () => {
		// if (!gl || video.readyState < video.HAVE_CURRENT_DATA) return;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		requestAnimationFrame(render);
	};
	requestAnimationFrame(render);
};

export default renderer;
