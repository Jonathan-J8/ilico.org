const vertexShaderSource = `#version 300 es
in vec2 position; in vec2 uv; out vec2 v_uv;
void main() { gl_Position = vec4(position, 0, 1); v_uv = uv;}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform sampler2D textureA;

out vec4 fragColor;

in vec2 v_uv;

void main() {
    fragColor = texture(textureA, v_uv);
}`;


class WebGLApp {
    private readonly canvas: HTMLCanvasElement | null;
    private readonly gl: WebGL2RenderingContext | null;
    private readonly program: any;
    private readonly vertexShader: WebGLShader | null;
    private readonly fragmentShader: WebGLShader | null;
    uniforms = {
        //@ts-ignore
        texture: (i: HTMLImageElement) => {
        },
        //@ts-ignore
        resolution: (x: number, y: number) => {
        },
        //@ts-ignore
        pixelSize: (v: number) => {
        },
    };

    constructor(canvas: HTMLCanvasElement) {

        this.canvas = canvas;
        // WebGL
        if (!this.canvas) throw new Error('PixelateImages: no canvas found');
        this.gl = this.canvas.getContext('webgl2');
        if (!this.gl) throw new Error('PixelateImages: problem while loading webgl2 context');

        // If code completion is essential and the above workarounds do not restore it,
        // use a regular property access instead.
        const gl = this.gl;

        this.program = gl.createProgram();

        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!this.vertexShader) throw new Error('PixelateImages: no vertex shader found');
        gl.shaderSource(this.vertexShader, vertexShaderSource);
        gl.compileShader(this.vertexShader);
        gl.attachShader(this.program, this.vertexShader);

        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!this.fragmentShader) throw new Error('PixelateImages: no vertex shader found');
        gl.shaderSource(this.fragmentShader, fragmentShaderSource);
        gl.compileShader(this.fragmentShader);
        gl.attachShader(this.program, this.fragmentShader);

        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.log(gl.getShaderInfoLog(this.vertexShader));
            console.log(gl.getShaderInfoLog(this.fragmentShader));
        }

        gl.useProgram(this.program);

        // Quad geometry
        {
            const datas = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW);
            const location = gl.getAttribLocation(this.program, 'position');
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
        }

        {
            const datas = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW);
            const location = gl.getAttribLocation(this.program, 'uv');
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
        }

        // Textures

        const location = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, location);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.uniform1i(gl.getUniformLocation(this.program, "textureA"), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    update(image: HTMLImageElement) {
        if (!this.gl || !this.canvas) return;
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            image
        );
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    resize() {
        if (!this.gl || !this.canvas) return;
        //  Set the canvas’s pixel size to the CSS size multiplied by the device pixel ratio.
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Update WebGL viewport:
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default WebGLApp;
