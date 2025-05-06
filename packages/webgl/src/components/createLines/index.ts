import { CubeTexture, InstancedMesh } from 'three';

import createGeometry from './createGeometry';
import createMaterial from './createMaterial';

type Props = {
	name: string;
	uniforms: Parameters<typeof createMaterial>[0]['uniforms'];
	envMap: CubeTexture;
	count: number;
	width: number;
	height: number;
};

const createLines = ({ name, uniforms, envMap, count, width = 1, height = 1 }: Props) => {
	const material = createMaterial({ uniforms, envMap, count, height });
	const geometry = createGeometry({ count, width, height });
	const mesh = new InstancedMesh(geometry, material, count);
	mesh.name = name;

	return {
		mesh,

		dispose: () => {
			material.dispose();
			geometry.dispose();
		},
	};
};

export default createLines;
