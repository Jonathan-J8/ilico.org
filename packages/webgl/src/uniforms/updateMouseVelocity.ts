import uniforms from './uniforms';

let prevX = 0;
let prevY = 0;
let timeoutId: ReturnType<typeof setTimeout> | undefined;

export const updateMouseVelocity = (event: PointerEvent) => {
	const { uDeltaTime, uMouseVelocity } = uniforms;

	const currX = event.pageX;
	const currY = event.pageY;
	uMouseVelocity.value.x = Math.abs(currX - prevX) * uDeltaTime.value;
	uMouseVelocity.value.y = Math.abs(currY - prevY) * uDeltaTime.value;
	prevX = currX;
	prevY = currY;

	if (typeof timeoutId === 'number') clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		uMouseVelocity.value.setScalar(0);
	}, 200);
};

export default updateMouseVelocity;
