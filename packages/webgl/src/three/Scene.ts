import { Material, Scene } from "three";

class CustomScene extends Scene {
  constructor() {
    super();
  }

  private static disposeMaterial = (material: Material) => {
    Object.values(material).forEach((value) => {
      if (typeof value?.dipose === "function") value.dipose();
    });
  };

  private static disposeNode = (node: any) => {
    if (node?.geometry) node.geometry.dispose();

    if (node?.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach((m: Material) => {
          CustomScene.disposeMaterial(m);
          m.dispose();
        });
      } else {
        CustomScene.disposeMaterial(node.material);
        node.material.dispose();
      }
    }
    node.children.forEach((child: any) => this.disposeNode(child));
  };

  dispose = () => {
    this.children.forEach((child) => CustomScene.disposeNode(child));
    this.clear();
  };
}

export default CustomScene;
