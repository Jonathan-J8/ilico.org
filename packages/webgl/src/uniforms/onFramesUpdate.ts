import damp2 from '../utils/damp2';
import Spring from '../utils/Spring';
import uniforms from './uniforms';

const createMouseWorldPositionLerp = () => {
	const optionsPosition = {
		mass: 1,
		tension: 0.2,
		friction: 0.4,
		threshold: 0.01,
	};

	const x = new Spring(0, {
		...optionsPosition,
		onUpdate: (v) => {
			uniforms.uMouseWorldPositionLerp.value.x = v;
		},
	});
	const y = new Spring(0, {
		...optionsPosition,
		onUpdate: (v) => {
			uniforms.uMouseWorldPositionLerp.value.y = v;
		},
	});
	const z = new Spring(0, {
		...optionsPosition,
		onUpdate: (v) => {
			uniforms.uMouseWorldPositionLerp.value.z = v;
		},
	});

	const reset = () => {
		const vec = uniforms.uMouseWorldPosition.value;
		x.to(vec.x);
		y.to(vec.y);
		z.to(vec.z);
	};

	const update = (d: number) => {
		x.update(d);
		y.update(d);
		z.update(d);
	};

	return { reset, update };
};

// const createScrollLerp = () => {
// 	const optionsPosition = {
// 		mass: 0.1,
// 		tension: 2,
// 		friction: 0.5,
// 		threshold: 0.01,
// 	};

// 	const x = new Spring(0, {
// 		...optionsPosition,
// 		onUpdate: (v) => {
// 			uniforms.uScrollVelocityLerp.value.x = v;
// 		},
// 	});
// 	const y = new Spring(0, {
// 		...optionsPosition,
// 		onUpdate: (v) => {
// 			uniforms.uScrollVelocityLerp.value.y = v;
// 		},
// 	});

// 	const reset = () => {
// 		const vec = uniforms.uScrollVelocity.value;
// 		x.to(vec.x);
// 		y.to(vec.y);
// 	};

// 	const update = (d: number) => {
// 		x.update(d);
// 		y.update(d);
// 	};

// 	return { reset, update };
// };

const dampMouseVelocity = (d: number) => {
	const { uMouseVelocity, uMouseVelocityLerp } = uniforms;
	const velocity = uMouseVelocity.value;

	uMouseVelocityLerp.value.x = damp2(uMouseVelocityLerp.value.x, velocity.x, 0.01, d);
	uMouseVelocityLerp.value.y = damp2(uMouseVelocityLerp.value.y, velocity.y, 0.01, d);
};

const dampScroll = (d: number) => {
	const { uScrollVelocity, uScrollVelocityLerp } = uniforms;
	const velocity = uScrollVelocity.value;

	uScrollVelocityLerp.value.x = damp2(uScrollVelocityLerp.value.x, velocity.x, 0.005, d);
	uScrollVelocityLerp.value.y = damp2(uScrollVelocityLerp.value.y, velocity.y, 0.005, d);
};

const uMouseWorldPositionLerp = createMouseWorldPositionLerp();
// const uScrollVelocityLerp = createScrollLerp();

const reset = () => {
	uMouseWorldPositionLerp.reset();
	// uScrollVelocityLerp.reset();
};

const update = () => {
	const d = uniforms.uDeltaTime.value;
	uMouseWorldPositionLerp.update(d);
	// uScrollVelocityLerp.update(d);

	dampMouseVelocity(d);
	dampScroll(d);
};

export default { reset, update };
