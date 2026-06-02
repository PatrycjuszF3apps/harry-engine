import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        // Listen on all interfaces so Windows can see the container
        host: '0.0.0.0',
        port: 5173,
        // Disable host check for security in dev environment
        strictPort: true,
    }
});