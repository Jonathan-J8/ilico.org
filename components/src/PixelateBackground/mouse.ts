import { dampThreshold } from 'joeat-utils';

export const data = {
	position: {
		current: { x: 0, y: 0 },
		next: { x: 0, y: 0 },
	},
	velocity: {
		current: { x: 0, y: 0 },
		next: { x: 0, y: 0 },
	},
	scroll: {
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

export const onWindowScroll = () => {
	data.scroll.next.x = window.scrollX / (document.body.offsetWidth - window.innerWidth);
	data.scroll.next.y = window.scrollY / (document.body.offsetHeight - window.innerHeight);
};

export const onUpdate = (d: number) => {
	data.position.current.x = dampThreshold(data.position.current.x, data.position.next.x, 0.01, d);
	data.position.current.y = dampThreshold(data.position.current.y, data.position.next.y, 0.01, d);
	data.velocity.current.x = dampThreshold(data.velocity.current.x, data.velocity.next.x, 0.01, d);
	data.velocity.current.y = dampThreshold(data.velocity.current.y, data.velocity.next.y, 0.01, d);
	data.scroll.current.x = dampThreshold(data.scroll.current.x, data.scroll.next.x, 0.01, d);
	data.scroll.current.y = dampThreshold(data.scroll.current.y, data.scroll.next.y, 0.01, d);
};
