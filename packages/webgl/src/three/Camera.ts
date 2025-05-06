import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

type UserData = {
	controls: OrbitControls | undefined;
	direction: Vector3;
};

class Camera extends PerspectiveCamera {
	userData: UserData = {
		controls: undefined,
		direction: new Vector3(),
	};

	constructor(fov = 60, aspect = 16 / 9, near = 0.1, far = 1000) {
		super(fov, aspect, near, far);
		this.position.z = 20;
	}

	set controls(b: boolean) {
		const { controls } = this.userData;
		if (!controls) return;
		controls.enabled = b;
	}
	get controls() {
		const { controls } = this.userData;
		return controls?.enabled || false;
	}

	initControls = (canvas: HTMLCanvasElement) => {
		this.userData.controls = new OrbitControls(this, canvas);
		this.userData.controls.addEventListener('change', () => {
			this.getWorldDirection(this.userData.direction);
		});
	};

	disposeControls = () => {
		const { controls } = this.userData;
		if (controls) {
			controls.disconnect();
			controls.dispose();
		}
	};

	resize = ({ width, height }: { width: number; height: number }) => {
		this.aspect = width / height;
		this.updateProjectionMatrix();
	};

	dispose = () => {
		this.disposeControls();
		this.clear();
	};
}

export default Camera;
