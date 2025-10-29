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

export default compileShader;
