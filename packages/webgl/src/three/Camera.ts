import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

type UserData = {
  controls: OrbitControls | undefined;
};

class Camera extends PerspectiveCamera {
  userData: UserData = {
    controls: undefined,
  };

  constructor(fov = 60, aspect = 16 / 9, near = 0.1, far = 1000) {
    super(fov, aspect, near, far);
    this.position.z = 10;
  }

  // head = new Vector3();

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
