import { DataTexture } from "three";

const size = 1;
const emptyTexture = new DataTexture(new Uint8Array(size * size), size, size);

export default emptyTexture;
