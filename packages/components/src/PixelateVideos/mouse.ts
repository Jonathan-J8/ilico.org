import { damp2 } from 'pkg-utils';

export const data = {
	position: {
		current: { x: 0, y: 0 },
		next: { x: 0, y: 0 },
	},
	velocity: {
		current: { x: 0, y: 0 },
		next: { x: 0, y: 0 },
	},
};

export const onPointerMove = (e: PointerEvent) => {
	data.position.next.x = e.offsetX;
	data.position.next.y = e.offsetY;
	data.velocity.next.x = e.movementX || 1;
	data.velocity.next.y = e.movementY || 1;
};

export const onPointerOut = () => {
	data.position.next.x = -10;
	data.position.next.y = -10;
	data.velocity.next.x = 0;
	data.velocity.next.y = 0;
};

export const onUpdate = ({ deltaTime }: { deltaTime: number }) => {
	data.position.current.x = damp2(data.position.current.x, data.position.next.x, 0.01, deltaTime);
	data.position.current.y = damp2(data.position.current.y, data.position.next.y, 0.01, deltaTime);
	data.velocity.current.x = damp2(
		data.velocity.current.x,
		data.velocity.next.x,
		0.01,
		deltaTime,
		0.001
	);
	data.velocity.current.y = damp2(
		data.velocity.current.y,
		data.velocity.next.y,
		0.01,
		deltaTime,
		0.001
	);
};
