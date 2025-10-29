// Debug utility to help identify WebGL issues in different browsers
export const debugWebGL = (canvas: HTMLCanvasElement) => {
	console.log('=== WebGL Debug Information ===');

	// Basic browser info
	console.log('User Agent:', navigator.userAgent);
	console.log('Platform:', navigator.platform);

	// Check WebGL support
	const webgl2 = canvas.getContext('webgl2');
	const webgl1 = canvas.getContext('webgl');

	console.log('WebGL2 supported:', !!webgl2);
	console.log('WebGL1 supported:', !!webgl1);

	const gl = webgl2 || webgl1;
	if (!gl) {
		console.error('No WebGL context available');
		return;
	}

	console.log('Using:', webgl2 ? 'WebGL2' : 'WebGL1');

	// WebGL context information
	console.log('Vendor:', gl.getParameter(gl.VENDOR));
	console.log('Renderer:', gl.getParameter(gl.RENDERER));
	console.log('Version:', gl.getParameter(gl.VERSION));
	console.log('Shading Language Version:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	// Check extensions
	const extensions = gl.getSupportedExtensions();
	console.log('Supported Extensions:', extensions);

	// Check limits
	console.log('Max Texture Size:', gl.getParameter(gl.MAX_TEXTURE_SIZE));
	console.log('Max Viewport Dims:', gl.getParameter(gl.MAX_VIEWPORT_DIMS));
	console.log('Max Vertex Attribs:', gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
	console.log('Max Varying Vectors:', gl.getParameter(gl.MAX_VARYING_VECTORS));

	// Check for common required extensions
	const requiredExtensions = [
		'OES_texture_float',
		'OES_texture_float_linear',
		'WEBGL_lose_context',
	];

	requiredExtensions.forEach((ext) => {
		const available = gl.getExtension(ext);
		console.log(`Extension ${ext}:`, !!available);
	});

	console.log('=== End WebGL Debug ===');
};

// Test shader compilation
export const testShaders = (gl: WebGLRenderingContext | WebGL2RenderingContext) => {
	const vertexShader = `
		attribute vec2 position;
		void main() {
			gl_Position = vec4(position, 0.0, 1.0);
		}
	`;

	const fragmentShader = `
		precision mediump float;
		void main() {
			gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
	`;

	console.log('Testing basic shader compilation...');

	try {
		const vs = gl.createShader(gl.VERTEX_SHADER)!;
		gl.shaderSource(vs, vertexShader);
		gl.compileShader(vs);

		if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
			console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
		} else {
			console.log('✓ Vertex shader compiled');
		}

		const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
		gl.shaderSource(fs, fragmentShader);
		gl.compileShader(fs);

		if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
			console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
		} else {
			console.log('✓ Fragment shader compiled');
		}

		// Test program linking
		const program = gl.createProgram()!;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Program link error:', gl.getProgramInfoLog(program));
		} else {
			console.log('✓ Program linked successfully');
		}

		// Clean up
		gl.deleteShader(vs);
		gl.deleteShader(fs);
		gl.deleteProgram(program);
	} catch (error) {
		console.error('Shader test failed:', error);
	}
};
