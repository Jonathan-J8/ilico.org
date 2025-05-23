import { GLSL3, Mesh, OrthographicCamera, PlaneGeometry, ShaderMaterial } from 'three';
import Frames from '../three/Frames';
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

export const init = ({ uniforms }: { uniforms: any }) => {
	const renderer = new Renderer();

	const scene = new Scene();

	const camera = new OrthographicCamera(-2, 2, 2, -2, 0, 1);

	const material = new ShaderMaterial({
		glslVersion: GLSL3,
		vertexShader,
		fragmentShader,
		uniforms,
	});

	// const geometry = new PlaneGeometry(ratio * 2, 2, 1, 1);
	const geometry = new PlaneGeometry(2, 2, 1, 1);
	const mesh = new Mesh(geometry, material);

	scene.add(camera, mesh);

	const animate = () => {
		// const time = now();
		// material.uniforms.u_pixel_size.value = Math.sin(time * 0.001) * 100;
		renderer.update(scene, camera);
	};
	const frames = new Frames();
	frames.play(renderer.instance);
	frames.add(animate);

	return { camera, scene, material, renderer, frames };
};

export const setCanvas = ({
	renderer,
	camera,
	canvas,
}: {
	renderer: Renderer;
	camera: OrthographicCamera;
	canvas: HTMLCanvasElement;
}) => {
	const { width, height } = canvas;

	const pixelRatio = Math.min(window.devicePixelRatio, 2);
	const aspect = width / height;
	const frustum = 2;

	renderer.init(canvas, _isDev);
	camera.left = (frustum * aspect) / -2;
	camera.right = (frustum * aspect) / 2;
	camera.top = frustum / 2;
	camera.bottom = frustum / -2;

	renderer.resize({
		width,
		height,
		pixelRatio,
	});
	camera.updateProjectionMatrix();
};
