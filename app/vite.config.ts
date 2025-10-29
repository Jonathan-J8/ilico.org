import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	server: { port: 8080 },
	preview: { port: 8080 },
	plugins: [tailwindcss(), glsl()],
	base: '/ilico.org/',
});
