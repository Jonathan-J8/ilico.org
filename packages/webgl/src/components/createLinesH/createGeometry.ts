import {
  BufferGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  PlaneGeometry,
} from "three";

const createOffsets = ({
  count,
  width = 1,
  height = 1,
}: {
  count: number;
  width: number;
  height: number;
}) => {
  const offsets = new Float32Array(count * 3);

  for (let i = 0; i < count; ++i) {
    const inc = i * 3;
    const theta = Math.random() * Math.PI * 2; // Random angle around the cylinder
    const r = Math.sqrt(Math.random()) * width; // Random radius (using square root for uniform distribution)
    // const y = Math.random() * height; // Random height within the cylinder
    const y = Math.sqrt(Math.random()) * height - height * 0.5; // Random height within the cylinder

    // Convert cylindrical coordinates to Cartesian coordinates
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    offsets[inc + 0] = x;
    offsets[inc + 1] = y;
    offsets[inc + 2] = z;
    // offsets[inc + 3] = i / count;
  }
  return offsets;
};

type Props = {
  count: number;
  width: number;
  height: number;
};

const createGeometry = ({ count, width = 1, height = 1 }: Props) => {
  const geometry = new InstancedBufferGeometry();
  let temp: BufferGeometry | undefined = new PlaneGeometry(100, 0.02, 1, 1);
  temp.rotateY(Math.PI * 0.5);
  // temp.rotateZ(Math.PI * 0.5);
  geometry.index = temp.index;
  geometry.attributes = temp.attributes;
  temp.dispose();
  temp = undefined;

  const offsets = createOffsets({ count, width, height });
  geometry.setAttribute("offset", new InstancedBufferAttribute(offsets, 3));

  return geometry;
};

export default createGeometry;
