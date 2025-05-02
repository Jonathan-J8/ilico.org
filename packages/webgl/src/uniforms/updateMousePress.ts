import uniforms from "./uniforms";

const updateMousePress = (e: PointerEvent) => {
  const isMouse = e.pointerType === "mouse";
  if (isMouse) uniforms.uMousePress.value = e.pressure ? 1 : 0;
  else uniforms.uMousePress.value = e.pressure;
};

export default updateMousePress;
