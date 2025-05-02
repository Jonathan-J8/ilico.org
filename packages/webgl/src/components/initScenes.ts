import { damp, mapLinear } from 'three/src/math/MathUtils.js';
import type createBloomFx from '../components/createBloomFx';
import type createSky from '../components/createSky';
import { frames, gui } from '../three';

export const initScenes = (o: {
	debug: boolean;
	sky: ReturnType<typeof createSky>;
	bloom: ReturnType<typeof createBloomFx>;
}) => {
	const { debug, sky } = o;

	const scene1 = () =>
		frames.interpolate({
			from: 0,
			to: 3,
			onStart: () => {
				sky.params.horizonOffset.value = -2;
				sky.updateHorizonOffset();
			},

			onUpdate: ({ value, deltaTime }) => {
				const v = mapLinear(value, 0, 3, -2, 0);

				const prev = sky.params.horizonOffset.value;
				sky.params.horizonOffset.value = damp(prev, v, 0.01, deltaTime * 1000);
				sky.updateHorizonOffset();
			},
		});

	const scene2 = () =>
		frames.interpolate({
			from: 0,
			to: 2,
			onUpdate: console.log,
		});

	// wait(500).then(async () => {
	//   await scene1();
	// });

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
		const folder = gui.addFolder('SCENES');
		folder
			.add({ scenes: 'default' }, 'scenes', ['default', 'scene1', 'scene2'])
			.onChange((s: string) => {
				switch (s) {
					case 'scene1':
						scene1();
						break;
					case 'scene2':
						scene2();
						break;
				}
			});
	}
};

export default initScenes;
