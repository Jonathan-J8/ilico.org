import { CubeTexture, InstancedMesh } from "three";

import createMaterial from "./createMaterial";
import createGeometry from "./createGeometry";
import { GlobalUniforms } from "../../uniforms";

type Props = {
  uniforms: GlobalUniforms;
  envMap: CubeTexture;
  count: number;
  width: number;
  height: number;
};

const createLines = ({
  uniforms,
  envMap,
  count,
  width = 1,
  height = 1,
}: Props) => {
  const material = createMaterial({ uniforms, envMap });
  const geometry = createGeometry({ count, width, height });
  const mesh = new InstancedMesh(geometry, material, count);
  // mesh.rotateX(Math.PI * 0.5);

  mesh.position.set(-10, -5, 0);
  mesh.rotateY(Math.PI * -0.2);
  return {
    mesh,

    dispose: () => {
      material.dispose();
      geometry.dispose();
    },
  };
};

export default createLines;
// const material = new ShaderMaterial({
//   glslVersion: GLSL3,
//   side: DoubleSide,
//   transparent: true,
//   // wireframe: true,
//   vertexShader,
//   fragmentShader,

//   uniforms: {
//     // count: { value: COUNT },
//     // scrollY: { value: 0 },
//     ...uniforms,
//     uMousePositionLerp: { value: new Vector3() },
//     uMouseVelocityLerp: { value: new Vector2() },
//     displacementMap: { value: null },
//   },
// });
