import {
	WebGLRenderer,
	FloatType,
	RGBAFormat,
	NearestFilter,
	ClampToEdgeWrapping,
	ShaderMaterial,
	WebGLRenderTarget,
	PerspectiveCamera,
	PlaneGeometry,
	Object3D,
	Mesh,
	GLSL3,
	FrontSide,
	type Object3DEventMap,
	type ShaderMaterialParameters,
} from 'three';

const createRt = () =>
	new WebGLRenderTarget(256, 256, {
		depthBuffer: false,
		stencilBuffer: false,
		type: FloatType,
		format: RGBAFormat,
		minFilter: NearestFilter,
		magFilter: NearestFilter,
		wrapS: ClampToEdgeWrapping,
		wrapT: ClampToEdgeWrapping,
	});

const vertexShader = `
precision lowp float;
out vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position, 1.);
}`;

const fragmentShader = `
precision lowp float;
layout(location = 0) out lowp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
uniform sampler2D tDiffuse;
in vec2 vUv;
`;

class Effect {
	#effect: Mesh<PlaneGeometry, ShaderMaterial, Object3DEventMap>;
	#rt: WebGLRenderTarget;
	#material: ShaderMaterial;
	// #rt2: WebGLRenderTarget;
	#group: Object3D;

	constructor(params: ShaderMaterialParameters) {
		this.#rt = createRt();
		this.#group = new Object3D();

		this.#material = new ShaderMaterial({
			...params,
			glslVersion: GLSL3,
			precision: 'lowp',
			side: FrontSide,
			transparent: true,
			vertexShader,
			fragmentShader: `${fragmentShader} ${params?.fragmentShader}`,
			uniforms: { ...params?.uniforms, tDiffuse: { value: this.#rt.texture } },
		});
		this.#effect = new Mesh(new PlaneGeometry(2, 2, 1, 1), this.#material);
	}

	get texture() {
		return this.#rt.texture;
	}
	get output() {
		return this.#effect;
	}

	set shader(s: string) {
		this.#material.fragmentShader = `${fragmentShader} ${s}`;
	}

	resize = (size: number) => {
		this.#rt.setSize(size, size);
	};

	add = (...o: Object3D[]) => {
		this.#group.add(...o);
	};

	dispose = () => {
		this.#rt.dispose();
		this.#effect.geometry.dispose();
		this.#material.dispose();
		this.#group.clear();
	};

	update = (renderer: WebGLRenderer, camera: PerspectiveCamera) => {
		renderer.setRenderTarget(this.#rt);
		renderer.render(this.#group, camera);
		renderer.setRenderTarget(null);
	};
}

export default Effect;
