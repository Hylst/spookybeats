import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// SpookyBeats — Application musicale Halloween par Geoffroy Streit (Hylst)
// Build statique Nginx/Coolify : adapter `base` selon le chemin de déploiement.
// Si déployé à la racine du domaine : base: '/'
// Si déployé sous /spookybeats/ : base: '/spookybeats/'
export default defineConfig(() => {
  return {
    base: '/spookybeats/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          // Éviter les chunks trop fragmentés pour un build statique propre
          manualChunks: undefined,
        },
      },
    },
    server: {
      // Proxy de développement local pour accéder aux MP3 sur hylst.fr sans CORS.
      // En production, les requêtes /hml/* et /mp3/* seront gérées par le navigateur
      // avec le fallback direct vers https://hylst.fr (voir audioEngine.ts).
      hmr: true,
      proxy: {
        '/hml': {
          target: 'https://hylst.fr',
          changeOrigin: true,
          secure: false,
        },
        '/mp3': {
          target: 'https://hylst.fr',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
