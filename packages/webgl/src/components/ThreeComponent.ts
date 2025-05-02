import { Object3D } from 'three';
import { Pass } from 'three/examples/jsm/Addons.js';
import { bin, frames, renderer, resizer, scene } from '../three';
import type Frames from '../three/Frames';
import type Resizer from '../three/Resizer';

type Component = {
	mesh?: Object3D;
	meshes?: Object3D[];
	fx?: Pass;
	update?: Parameters<Frames['add']>[0];
	resize?: Parameters<Resizer['add']>[0];
	dispose?: () => void;
};

class ThreeComponent {
	static add({ mesh, meshes, fx, update, resize, dispose }: Component) {
		if (mesh) {
			scene.add(mesh);
			bin.add(() => scene.remove(mesh));
		}
		if (meshes?.length) {
			scene.add(...meshes);
			bin.add(() => scene.remove(...meshes));
		}
		if (fx) {
			renderer.addEffect(fx);
			bin.add(() => renderer.removeEffect(fx));
		}
		if (update) {
			frames.add(update);
			bin.add(() => frames.remove(update));
		}
		if (resize) {
			resizer.add(resize);
			bin.add(() => resizer.remove(resize));
		}
		if (dispose) bin.add(dispose);
	}
}

export default ThreeComponent;
