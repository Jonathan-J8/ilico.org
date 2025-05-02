import {
  CubeCamera,
  HalfFloatType,
  WebGLCubeRenderTarget,
  type WebGLRenderer,
  type Scene,
} from "three";

const createCubeTexture = () => {
  const rt = new WebGLCubeRenderTarget(256);
  rt.texture.type = HalfFloatType;

  const camera = new CubeCamera(1, 1000, rt);

  const update = ({
    renderer,
    scene,
  }: {
    renderer: WebGLRenderer;
    scene: Scene;
  }) => {
    camera.update(renderer, scene);

    // renderer.readRenderTargetPixels(ren, 128, 128, 1, 1, pixelBuffer);
  };

  const dispose = () => {
    camera.clear();
    rt.dispose();
  };

  return {
    get texture() {
      return rt.texture;
    },
    update,
    dispose,
  };
};

export default createCubeTexture;
