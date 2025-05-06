import { FXAAShader, OutputPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { camera, frames, gui, renderer, scene } from '../three';
import { uniforms } from '../uniforms';
import ThreeComponent from './ThreeComponent';

import { mapLinear } from 'three/src/math/MathUtils.js';
import createBloomFx from './createBloomFx';
import createCubeTexture from './createCubeTexture';
import createLines from './createLines';
import createSky from './createSky';
import initScenes from './initScenes';

export const initComponents = ({ debug }: { debug: boolean; canvas: HTMLCanvasElement }) => {
	const HEIGHT_SCENE = 50;
	const cubeTexture = createCubeTexture();
	const sky = createSky({ uniforms });
	const bloom = createBloomFx({ uniforms });
	const lines = createLines({
		name: 'lines0',
		uniforms,
		envMap: cubeTexture.texture,
		count: 128,
		height: HEIGHT_SCENE,
		width: 50,
	});

	const update = () => {
		if (!renderer.instance) return;
		cubeTexture.update({ renderer: renderer.instance, scene });
		sky.mesh.rotation.x = uniforms.uTime.value * 0.0003;
		sky.mesh.rotation.y = uniforms.uTime.value * -0.0002;
		if (camera.controls) return;
		const { uScroll } = uniforms;
		camera.position.y = uScroll.value.y * -HEIGHT_SCENE;
		const y = mapLinear(uScroll.value.y, 0, 1, 0, 0.5);
		sky.params.horizonOffset.value = -0.9 + y;
		sky.updateHorizonOffset();
	};

	frames.add(update);

	ThreeComponent.add(sky);
	ThreeComponent.add(bloom);
	ThreeComponent.add(lines);
	ThreeComponent.add({ fx: new ShaderPass(FXAAShader) });
	ThreeComponent.add({ fx: new OutputPass() });

	initScenes({ debug, sky, bloom });

	/**
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 * GUI
	 */
	if (!debug) return;

	{
		const folder = gui.addFolder('BLOOM');
		const params = bloom.params;
		folder.add(bloom.fx, 'enabled').onChange((b: boolean) => {
			bloom.fx.enabled = b;
		});
		folder.add(params, 'strength', 0, 1).onChange(bloom.update);
		folder.add(params, 'radius', 0, 1).onChange(bloom.update);
		folder.add(params, 'threshold', 0, 1).onChange(bloom.update);
	}
	{
		const folder = gui.addFolder('SKY');
		// folder.close();
		const params = sky.params;
		folder.add(sky.mesh, 'visible');
		folder.add(params.turbidity, 'value', 0, 20).name('turbidity');
		folder.add(params.rayleigh, 'value', 0, 1).name('rayleigh');
		folder.add(params.mieCoefficient, 'value', 0.001, 0.01).name('mieCoefficient');
		folder.add(params.mieDirectionalG, 'value', 0, 1).name('mieDirectionalG');
		folder.add(params.sunOpacity, 'value', 0, 1).name('sunOpacity');
		folder
			.add(params.horizonOffset, 'value', -1, 2, 0.0001)
			.name('horizonOffset')
			.onChange(sky.updateHorizonOffset);
		folder
			.add(params.elevation, 'value', -2, 90)
			.name('elevation')
			.onChange(sky.updateSunPosition)
			.listen();
		folder
			.add(params.azimuth, 'value', 0, 360)
			.name('azimuth')
			.onChange(sky.updateSunPosition)
			.listen();
		folder
			.add({ hours: 12 }, 'hours', 0, 24)
			.name('hours')
			.onChange((h: number) => {
				const PI2 = Math.PI * 2;
				const HALF_PI = Math.PI / 2;
				const elevation = 0.5 * (1 + Math.sin((h / 24) * PI2 - HALF_PI));

				sky.params.elevation.value = elevation * 90;
				sky.params.azimuth.value = mapLinear(h, 0, 24, 360, 0);
				sky.updateSunPosition();
			});
	}
};
