import { Vector2, Vector3 } from 'three';
import { damp } from 'three/src/math/MathUtils.js';
import Spring from '../utils/Spring';

const optionsPosition = {
	mass: 0.1,
	tension: 2,
	friction: 0.5,
	threshold: 0.01,
};
const createMouseWPS = () => {
	const _vec0 = new Vector3();
	const _vec1 = new Vector2();
	const x = new Spring(0, {
		...optionsPosition,
		onUpdate: (v) => {
			_vec0.x = v;
		},
	});
	const y = new Spring(0, {
		...optionsPosition,
		onUpdate: (v) => {
			_vec0.y = v;
		},
	});
	const z = new Spring(0, {
		...optionsPosition,
		onUpdate: (v) => {
			_vec0.z = v;
		},
	});
	// const xx = new Spring(0, {
	//   ...optionsVelocity,
	//   onUpdate: (v) => {
	//     _vec1.x = v;
	//   },
	// });
	// const yy = new Spring(0, {
	//   ...optionsVelocity,
	//   onUpdate: (v) => {
	//     _vec1.y = v;
	//   },
	// });

	const setPosition = (position: Vector3) => {
		x.to(position.x);
		y.to(position.y);
		z.to(position.z);
	};

	const updatePosition = (d: number) => {
		x.update(d);
		y.update(d);
		z.update(d);
	};
	const updateVelocity = (d: number, velocity: Vector2) => {
		_vec1.x = damp(_vec1.x, velocity.x * 10, 0.001, d * 1000);
		_vec1.y = damp(_vec1.y, velocity.y * 10, 0.001, d * 1000);
	};

	return {
		get position() {
			return _vec0;
		},
		get velocity() {
			return _vec1;
		},
		setPosition,
		updatePosition,
		updateVelocity,
	};
};

export default createMouseWPS;
