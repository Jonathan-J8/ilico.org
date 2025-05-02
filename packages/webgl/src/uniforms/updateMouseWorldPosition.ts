import { Plane, Raycaster, Vector3 } from "three";
import { camera } from "../three";
import uniforms from "./uniforms";

const origin = new Vector3(0, 0, 0);
const plane = new Plane();
const raycaster = new Raycaster();

const updateMouseWorldPosition = () => {
  const { uMousePosition, uMouseWorldPosition, uCameraDirection } = uniforms;

  raycaster.setFromCamera(uMousePosition.value, camera);
  plane.setFromNormalAndCoplanarPoint(uCameraDirection.value, origin);
  raycaster.ray.intersectPlane(plane, uMouseWorldPosition.value);
};

export default updateMouseWorldPosition;
