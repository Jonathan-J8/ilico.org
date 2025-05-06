import { BackSide, ShaderMaterial, SphereGeometry } from 'three';
import { Sky } from 'three/examples/jsm/Addons.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { GlobalUniforms } from '../../uniforms';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';

const createSky = ({ uniforms: globalUni }: { uniforms: GlobalUniforms }) => {
	class CustomSky extends Sky {
		constructor() {
			super();
			this.material = new ShaderMaterial({
				name: 'CustomSky',
				uniforms: {
					//@ts-ignore
					...Sky.SkyShader.uniforms,
					...globalUni,
					sunOpacity: {
						value: 0,
					},
					horizonOffset: {
						value: 0,
					},
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				side: BackSide,
				depthWrite: false,
			});
			//@ts-ignore
			this.geometry = new SphereGeometry(1, 50, 50);
		}
	}
	//@ts-ignore
	// CustomSky.SkyShader.uniforms.map = { value: null };

	const SCALE = 45000;
	const mesh = new CustomSky();
	mesh.name = 'sky';
	mesh.material.uniforms = { ...globalUni, ...mesh.material.uniforms };
	const uniforms = mesh.material.uniforms;
	const datas = {
		horizonOffset: { value: -0.9 },
		elevation: { value: 0 },
		azimuth: { value: 180 },
	};
	uniforms.turbidity.value = 10;
	uniforms.rayleigh.value = 2;
	uniforms.mieCoefficient.value = 0.005;
	uniforms.mieDirectionalG.value = 0.8;
	uniforms.sunOpacity.value = 1;

	const updateSunPosition = () => {
		const { sunPosition } = uniforms;
		const phi = degToRad(90 - datas.elevation.value);
		const theta = degToRad(datas.azimuth.value);
		sunPosition.value.setFromSphericalCoords(1, phi, theta);
	};

	const updateHorizonOffset = () => {
		const { horizonOffset } = uniforms;

		horizonOffset.value = datas.horizonOffset.value * -SCALE;
	};

	const dispose = () => {
		mesh.material.dispose();
		mesh.geometry.dispose();
	};

	mesh.scale.setScalar(SCALE);

	updateHorizonOffset();
	updateSunPosition();

	return Object.freeze({
		get mesh() {
			return mesh;
		},

		get params() {
			const { turbidity, rayleigh, mieCoefficient, mieDirectionalG, sunOpacity } = uniforms;

			return {
				turbidity,
				rayleigh,
				mieCoefficient,
				mieDirectionalG,
				sunOpacity,
				...datas,
			};
		},
		updateHorizonOffset,
		updateSunPosition,
		dispose,
	});
};

export default createSky;
