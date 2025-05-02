import Spring from "../utils/Spring";
import uniforms from "./uniforms";

const optionsPosition = {
  mass: 0.1,
  tension: 2,
  friction: 0.5,
  threshold: 0.01,
};

const x = new Spring(0, {
  ...optionsPosition,
  onUpdate: (v) => {
    uniforms.uMouseWorldPositionLerp.value.x = v;
  },
});
const y = new Spring(0, {
  ...optionsPosition,
  onUpdate: (v) => {
    uniforms.uMouseWorldPositionLerp.value.y = v;
  },
});
const z = new Spring(0, {
  ...optionsPosition,
  onUpdate: (v) => {
    uniforms.uMouseWorldPositionLerp.value.z = v;
  },
});

const reset = () => {
  const position = uniforms.uMouseWorldPosition.value;
  x.to(position.x);
  y.to(position.y);
  z.to(position.z);
};

const update = () => {
  const d = uniforms.uDeltaTime.value;
  x.update(d);
  y.update(d);
  z.update(d);
};

export default { reset, update };
