export type Texture = {
	readonly location: WebGLTexture;
	readonly index: number;
	readonly name: string;
	value: HTMLVideoElement | null;
};
