import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import glsl from 'vite-plugin-glsl';

const _isProd = process.env.NODE_ENV === 'production';
const _isDev = !_isProd;

export default defineConfig({
	server: {
		port: 8080,
	},
	plugins: [
		dts(),
		glsl({
			removeDuplicatedImports: true,
			warnDuplicatedImports: _isDev,
			minify: _isProd,
			watch: _isDev,
			root: '/',
		}),
	],
	build: {
		lib: {
			name: 'webgl',
			entry: ['src/index.ts'],
			fileName: (format, entryName) => `${entryName}.${format}.js`,
		},
	},
});
