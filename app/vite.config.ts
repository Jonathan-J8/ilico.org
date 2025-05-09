import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 8080 },
	preview: { port: 8080 },
	plugins: [tailwindcss()],
});
