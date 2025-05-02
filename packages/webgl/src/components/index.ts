import { FXAAShader, OutputPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { frames, gui, renderer, scene } from '../three';
import { uniforms } from '../uniforms';
import ThreeComponent from './ThreeComponent';

import createBloomFx from './createBloomFx';
import createCubeTexture from './createCubeTexture';
import createLinesClusters from './createLinesClusters';
import createSky from './createSky';
// import createLines3 from "./createLines3";
import { mapLinear } from 'three/src/math/MathUtils.js';
import initScenes from './initScenes';

export const initComponents = ({ debug }: { debug: boolean; canvas: HTMLCanvasElement }) => {
	const cubeTexture = createCubeTexture();
	const sky = createSky({ uniforms });
	const bloom = createBloomFx({ uniforms });

	const lines = createLinesClusters({ uniforms, envMap: cubeTexture.texture });
	// const lines = createLines3({
	//   uniforms,
	//   envMap: cubeTexture.texture,
	//   count: 50,
	//   height: 10,
	//   width: 2,
	// });
	// const cylinders = createCylinders({ envMap: cubeTexture.texture, uniforms });
	// const meshTest = createMesh({ envMap: cubeTexture.texture });
	// const clouds = createClouds();

	// clouds.mesh.visible = false;
	// cylinders.mesh.visible = false;
	// meshTest.mesh.visible = false;

	// const dt = debugTexture(() => waterGpgpu.texture);
	// dt.mesh.position.z = 7;
	// scene.add(dt.mesh)
	// bin.add(dt.dispose)

	// const g = new SphereGeometry();
	// g.center();
	// const m = new Mesh(g, new MeshBasicMaterial({ color: 0xff }));
	// m.visible = false;
	// scene.add(m);

	const update = ({}: { time: number; deltaTime: number }) => {
		// controls.update(deltaTime);

		// const { position, velocity } = mouse;
		// m.position.x = position.x;
		// m.position.y = position.y;
		// m.position.z = position.z;
		// m.scale.setScalar(velocity.x);

		// lines.uniforms.uMousePositionLerp.value.copy(position);
		// lines.uniforms.uMouseVelocityLerp.value.copy(velocity);

		if (!renderer.instance) return;
		cubeTexture.update({ renderer: renderer.instance, scene });
	};

	frames.add(update);

	ThreeComponent.add(sky);
	ThreeComponent.add(bloom);
	ThreeComponent.add(lines);
	// ThreeComponent.add(lines3);
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
		// folder.close();
		const params = bloom.params;
		bloom.fx.enabled = false;
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
		folder.add(params.turbidity, 'value', 0, 20).name('turbidity');
		folder.add(params.rayleigh, 'value', 0, 1).name('rayleigh');
		folder.add(params.mieCoefficient, 'value', 0.001, 0.01).name('mieCoefficient');
		folder.add(params.mieDirectionalG, 'value', 0, 1).name('mieDirectionalG');
		folder.add(params.sunOpacity, 'value', 0, 1).name('sunOpacity');
		folder
			.add(params.horizonOffset, 'value', -2, 2)
			.name('horizonOffset')
			.onChange(sky.updateHorizonOffset);
		folder
			.add(params.elevation, 'value', 0, 90)
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
