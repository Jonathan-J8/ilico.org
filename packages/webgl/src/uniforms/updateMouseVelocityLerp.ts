import { damp } from "three/src/math/MathUtils.js";
import uniforms from "./uniforms";

const updateMouseVelocityLerp = () => {
  const { uDeltaTime, uMouseVelocity, uMouseVelocityLerp } = uniforms;
  const d = uDeltaTime.value;
  const velocity = uMouseVelocity.value;

  uMouseVelocityLerp.value.x = damp(
    uMouseVelocityLerp.value.x,
    velocity.x * 10,
    0.001,
    d * 1000,
  );
  uMouseVelocityLerp.value.y = damp(
    uMouseVelocityLerp.value.y,
    velocity.y * 10,
    0.001,
    d * 1000,
  );
};

export default updateMouseVelocityLerp;
