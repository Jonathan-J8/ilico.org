import type createBloomFx from '../components/createBloomFx';
import type createSky from '../components/createSky';
import { frames, gui } from '../three';
import type createLines from './createLines';

export const initScenes = (o: {
	debug: boolean;
	sky: ReturnType<typeof createSky>;
	bloom: ReturnType<typeof createBloomFx>;
	lines: ReturnType<typeof createLines>;
}) => {
	const { debug, sky } = o;

	const scene1 = () => {
		sky.params.horizonOffset.value = -0.96;
		sky.updateHorizonOffset();

		// gui.load(presets);
	};

	scene1();
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
		gui.add({ scenes: 'scene1' }, 'scenes', ['scene1', 'scene2']).onChange((s: string) => {
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
