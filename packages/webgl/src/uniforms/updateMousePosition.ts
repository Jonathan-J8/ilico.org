import { renderer } from "../three";
import uniforms from "./uniforms";

const updateMousePosition = (event: PointerEvent) => {
  if (!renderer.instance) return;

  const { clientWidth, clientHeight } = renderer.instance.domElement;
  const { uMousePosition } = uniforms;

  uMousePosition.value.x = (event.clientX / clientWidth) * 2 - 1;
  uMousePosition.value.y = -(event.clientY / clientHeight) * 2 + 1;
};

export default updateMousePosition;
