import {
	Mesh,
	OrthographicCamera,
	PlaneGeometry,
	Scene,
	ShaderMaterial,
	VideoTexture,
	WebGLRenderer,
} from 'three';

const vertexShader = /* glsl */ `
	varying vec2 v_uv;
	void main() {
	    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
	    v_uv = uv;
	}
`;

const fragmentShader = /*glsl*/ `
    uniform sampler2D map;
    varying vec2 v_uv;
    void main() {
        gl_FragColor = texture2D(map, v_uv);
     }
`;

const renderer = ({ canvas, video }: { canvas: HTMLCanvasElement; video: HTMLVideoElement }) => {
	const { width, height } = canvas;
	const renderer = new WebGLRenderer({ canvas });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(width, height);

	const texture = new VideoTexture(video);
	const scene = new Scene();
	const aspect = width / height;
	const frustum = 2;

	const camera = new OrthographicCamera(
		(frustum * aspect) / -2,
		(frustum * aspect) / 2,
		frustum / 2,
		frustum / -2,
		0,
		1
	);
	camera.zoom = 0;
	const material = new ShaderMaterial({
		// glslVersion: GLSL3,
		vertexShader,
		fragmentShader,
		uniforms: {
			map: { value: texture },
		},
	});

	// const material = new MeshBasicMaterial({
	// 	map: texture,
	// });
	const geometry = new PlaneGeometry(2, 2, 1, 1);
	const mesh = new Mesh(geometry, material);

	scene.add(camera, mesh);

	const animate = () => {
		// if (!gl || video.readyState < video.HAVE_CURRENT_DATA) return;

		renderer.render(scene, camera);
	};
	renderer.setAnimationLoop(animate);
};

export default renderer;
