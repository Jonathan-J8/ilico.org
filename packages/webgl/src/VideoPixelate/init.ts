import { GLSL3, Mesh, OrthographicCamera, PlaneGeometry, ShaderMaterial } from 'three';
import Renderer from '../three/Renderer';
import Scene from '../three/Scene';
import { _isDev } from '../utils/env';

const vertexShader = /* glsl */ `
	out vec2 v_uv;
	void main() {
	    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
	    v_uv = uv;
	}
`;

const fragmentShader = /*glsl*/ `
	layout(location = 0) out highp vec4 pc_fragColor;
	#define gl_FragColor pc_fragColor
    
	uniform sampler2D u_map_a;
	uniform sampler2D u_map_b;
    uniform vec2 u_resolution;
    uniform float u_pixel_size;
    in vec2 v_uv;

    void main() {

		vec2 uv = v_uv  * u_resolution;
		// float center = u_pixel_size * 0.5;
		// // Round to nearest pixel block
		// uv = floor(uv / u_pixel_size) * u_pixel_size + center;
		// // Convert back to normalized texture coordinates
		// uv /= u_resolution;


		// Shift origin to center before flooring
		vec2 centered = uv - 0.5 * u_resolution;
		centered = floor(centered / u_pixel_size) * u_pixel_size + 0.5 * u_pixel_size;

		// Shift back
		uv = centered + 0.5 * u_resolution;
		uv /= u_resolution;

        gl_FragColor = texture2D(u_map_a, uv);
     }
`;

const renderer = ({ canvas, uniforms }: { canvas: HTMLCanvasElement; uniforms: any }) => {
	const { width, height } = canvas;
	const pixelRatio = Math.min(window.devicePixelRatio, 2);
	const renderer = new Renderer();
	renderer.init(canvas, _isDev);

	// const texture = new VideoTexture(video);
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
	camera.updateProjectionMatrix();
	renderer.resize({
		width,
		height,
		pixelRatio,
	});
	const material = new ShaderMaterial({
		glslVersion: GLSL3,
		vertexShader,
		fragmentShader,
		uniforms,
	});

	const ratio = width / height;
	const geometry = new PlaneGeometry(ratio * 2, 2, 1, 1);
	const mesh = new Mesh(geometry, material);

	scene.add(camera, mesh);

	const animate = () => {
		// const time = now();
		// material.uniforms.u_pixel_size.value = Math.sin(time * 0.001) * 100;
		renderer.update(scene, camera);
	};
	renderer.instance?.setAnimationLoop(animate);

	return { camera, scene, material, renderer };
};

export default renderer;
