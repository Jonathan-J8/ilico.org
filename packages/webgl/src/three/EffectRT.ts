import {
	BufferGeometry,
	ClampToEdgeWrapping,
	FrontSide,
	GLSL3,
	LinearFilter,
	Mesh,
	OrthographicCamera,
	PlaneGeometry,
	RGBAFormat,
	Scene,
	ShaderMaterial,
	UnsignedByteType,
	WebGLRenderTarget,
	WebGLRenderer,
	type ShaderMaterialParameters,
} from 'three';

class RenderTarget {
	#geometry: BufferGeometry;
	#material: ShaderMaterial;
	#renderer: WebGLRenderTarget;
	#camera: OrthographicCamera;
	#scene = new Scene();
	#mesh: Mesh;

	constructor({
		resolution = 32,
		count = 1,
		uniforms,
		shader,
	}: {
		resolution: number;
		count?: number;
		uniforms: ShaderMaterialParameters['uniforms'];
		shader: string;
	}) {
		this.#renderer = new WebGLRenderTarget(resolution, resolution, {
			count,
			depthBuffer: false,
			stencilBuffer: false,
			// type: FloatType,
			type: UnsignedByteType,
			format: RGBAFormat,
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
		});

		this.#geometry = new PlaneGeometry(2, 2);
		this.#material = new ShaderMaterial({
			vertexShader: `out vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.); }`,
			fragmentShader: shader,
			glslVersion: GLSL3,
			// precision: 'highp',
			side: FrontSide,
			depthTest: false,
			depthWrite: false,
			transparent: false,
			uniforms,
		});

		const half = resolution / 2;
		this.#camera = new OrthographicCamera(-half, half, -half, half, -1, 1);
		this.#mesh = new Mesh(this.#geometry, this.#material);
		this.#scene.add(this.#camera, this.#mesh);
	}

	set visible(b: boolean) {
		this.#mesh.visible = b;
	}
	get visible() {
		return this.#mesh.visible;
	}

	get uniforms() {
		return this.#material.uniforms;
	}

	get textures() {
		return this.#renderer.textures;
	}

	dispose = () => {
		this.#scene.clear();
		this.#mesh.clear();
		this.#geometry.dispose();
		this.#material.dispose();
		this.#renderer.dispose();
	};

	update = (renderer: WebGLRenderer) => {
		renderer.setRenderTarget(this.#renderer);
		renderer.render(this.#scene, this.#camera);
		renderer.setRenderTarget(null);
	};
}

export default RenderTarget;
