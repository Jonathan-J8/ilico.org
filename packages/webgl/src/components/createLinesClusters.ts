import { CubeTexture, Group, Vector2, Vector3 } from 'three';
import type { GlobalUniforms } from '../uniforms';
import createLines from './createLines2';

const createLinesClusters = ({
	uniforms: gUniforms,
	envMap,
}: {
	uniforms: GlobalUniforms;
	envMap: CubeTexture;
}) => {
	const uniforms = {
		...gUniforms,
		uMousePositionLerp: { value: new Vector3() },
		uMouseVelocityLerp: { value: new Vector2() },
	};
	const l0 = createLines({
		index: 0,
		uniforms,
		envMap,
		width: 3,
		height: 10,
		count: 128,
	});
	// const l1 = createLines({
	//   index: 1,
	//   uniforms,
	//   envMap,
	//   width: 20,
	//   height: 20,
	//   count: 500,
	// });
	// const l2 = createLines({
	//   index: 2,
	//   uniforms,
	//   envMap,
	//   width: 2,
	//   height: 5,
	//   count: 50,
	// });
	// const l3 = createLines({
	//   index: 3,
	//   uniforms,
	//   envMap,
	//   width: 30,
	//   height: 5,
	//   count: 500,
	// });

	const group = new Group();

	group.add(l0.mesh);

	return {
		get mesh() {
			return group;
		},

		dispose: () => {
			group.clear();
			l0.dispose();
			// l1.dispose();
		},
	};
};

export default createLinesClusters;
