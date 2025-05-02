import uniforms from "./uniforms";

const updateTime = ({
  time,
  deltaTime,
}: {
  time: number;
  deltaTime: number;
}) => {
  const { uTime, uDeltaTime } = uniforms;
  uTime.value = time;
  uDeltaTime.value = deltaTime;
};

export default updateTime;
