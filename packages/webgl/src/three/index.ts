import {
	ACESFilmicToneMapping,
	AgXToneMapping,
	AxesHelper,
	Cache,
	CineonToneMapping,
	ColorManagement,
	Fog,
	GridHelper,
	LinearToneMapping,
	NeutralToneMapping,
	NoToneMapping,
	ReinhardToneMapping,
	SRGBColorSpace,
} from 'three';

import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import BatchFunction from '../utils/BatchFunction';
import Camera from './Camera';
import Frames from './Frames';
import Renderer from './Renderer';
import Resizer from './Resizer';
import Scene from './Scene';

export const scene = new Scene();
export const camera = new Camera();
export const renderer = new Renderer();
export const frames = new Frames();
export const resizer = new Resizer();
export const bin = new BatchFunction<[]>();
export const gui = new GUI();

const update = ({ deltaTime }: { time: number; deltaTime: number }) => {
	if (!renderer.instance) return;
	renderer.update(scene, camera, deltaTime);
};

const dispose = () => {
	frames.pause(renderer.instance);
	gui.destroy();
	bin.run();
	frames.remove(update);
	resizer.remove(renderer.resize);
	resizer.remove(camera.resize);
	bin.dispose();
	resizer.dispose();
	scene.dispose();
	camera.dispose();
	frames.dispose();
	renderer.dispose();
};

export const initThree = ({
	debug,
	canvas,
	browserName,
	controls = true,
}: {
	debug: boolean;
	canvas: HTMLCanvasElement;
	browserName?: string;
	controls: boolean;
}) => {
	if (debug) gui.show();
	else gui.destroy();

	Cache.enabled = true;
	ColorManagement.enabled = true;
	ColorManagement.workingColorSpace = SRGBColorSpace;

	scene.fog = new Fog(0xb2cdd8, 0.1, 100);
	scene.add(camera);
	camera.initControls(canvas);
	camera.controls = controls;

	resizer.add(renderer.resize);
	resizer.add(camera.resize);
	resizer.attachDomElement(canvas);

	renderer.init(canvas, debug, browserName);
	renderer.initComposer(scene, camera);
	if (!renderer.instance) throw new Error('WebGLRendeder not setup');
	renderer.instance.toneMapping = NeutralToneMapping;
	renderer.instance.compile(scene, camera);

	frames.add(update);
	frames.play(renderer.instance);

	const axis = new AxesHelper(100);
	const grid = new GridHelper(1);
	axis.visible = debug;
	grid.visible = debug;
	frames.debug = debug;
	scene.add(axis, grid);

	gui.add(
		{
			save: () => {
				const json = gui.save(true);
				const file = document.createElement('a');
				file.setAttribute(
					'href',
					'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json))
				);
				file.setAttribute('download', 'joeat-presets.json');
				file.click();
			},
		},
		'save'
	).name('save presets');
	gui.add({ helpers: debug }, 'helpers').onChange((b: boolean) => {
		frames.debug = b;
		axis.visible = b;
		grid.visible = b;
	});

	gui.add({ paused: frames.paused }, 'paused').onChange((b: boolean) => {
		if (!renderer.instance) return;
		if (b) frames.pause(renderer.instance);
		else frames.play(renderer.instance);
	});
	gui.add(resizer, 'maxSize', 0, 7680).name('max resolution');
	gui.add(resizer, 'resolutionFactor', 0.0, 1).name('resolution factor');
	gui.add(renderer, 'toneMapping', {
		NoToneMapping: NoToneMapping,
		LinearToneMapping: LinearToneMapping,
		ReinhardToneMapping: ReinhardToneMapping,
		CineonToneMapping: CineonToneMapping,
		ACESFilmicToneMapping: ACESFilmicToneMapping,
		AgXToneMapping: AgXToneMapping,
		NeutralToneMapping: NeutralToneMapping,
	}).name('tone mapping');
	gui.add(renderer, 'toneMappingExposure', 0, 1).name('tone mapping exposure');
	gui.add(camera, 'controls').name('camera controls');
	gui.add(camera.position, 'x').name('camera position x').listen();
	gui.add(camera.position, 'y').name('camera position y').listen();
	gui.add(camera.position, 'z').name('camera position z').listen();
	const dir = camera.userData.direction;
	gui.add(dir, 'x')
		.name('camera direction x')
		.onChange(() => {
			camera.lookAt(dir);
		})
		.listen();
	gui.add(dir, 'y')
		.name('camera direction y')
		.onChange(() => {
			camera.lookAt(dir);
		})
		.listen();
	gui.add(dir, 'z')
		.name('camera direction z')
		.onChange(() => {
			camera.lookAt(dir);
		})
		.listen();

	// const ambient = new AmbientLight(0xffffff);
	// const directional = new DirectionalLight(0xc5d1ff);
	// scene.add(ambient, directional);

	// const f = gui.addFolder('LIGHTS');
	// f.close();
	// f.add(ambient, 'visible').name('ambient light');
	// f.add(ambient, 'intensity', 0, 10).name('ambient intensity');
	// f.addColor(ambient, 'color').name('ambient color');
	// f.add(directional, 'visible').name('directional light');
	// f.add(directional, 'intensity', 0, 10).name('directional intensity');
	// f.addColor(directional, 'color').name('directional color');
	// bin.add(() => {
	// 	f.destroy();
	// });

	return dispose;
};
