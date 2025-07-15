const vertexShaderSource = `#version 300 es
in vec2 position; in vec2 uv; out vec2 v_uv;
void main() { gl_Position = vec4(position, 0, 1); v_uv = uv;}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 fragColor;

in vec2 v_uv;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;


class WebGLApp {
    private readonly canvas: HTMLCanvasElement | null;
    private readonly gl: WebGL2RenderingContext | null;
    private readonly program: any;
    private readonly vertexShader: WebGLShader | null;
    private readonly fragmentShader: WebGLShader | null;
    uniforms = {
        //@ts-ignore
        texture: (v: HTMLImageElement) => {
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

        const {gl} = this;
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
        gl?.drawArrays(gl?.TRIANGLES, 0, 6);

    }
}

export default WebGLApp;
