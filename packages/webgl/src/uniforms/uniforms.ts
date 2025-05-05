import { Vector2, Vector3 } from 'three';

const uniforms = {
	uTime: { value: 0 },
	uDeltaTime: { value: 0 },
	uResolution: { value: new Vector2() },
	uCameraDirection: { value: new Vector3() },
	uScroll: { value: new Vector2() },
	uScrollVelocity: { value: new Vector2() },
	uMousePress: { value: 0 },
	uMousePosition: { value: new Vector2() },
	uMouseWorldPosition: { value: new Vector3() },
	uMouseWorldPositionLerp: { value: new Vector3() },
	uMouseVelocity: { value: new Vector2() },
	uMouseVelocityLerp: { value: new Vector2() },
};

export type GlobalUniforms = typeof uniforms;

export default Object.freeze(uniforms);
