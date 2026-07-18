import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use the shared self-signed cert when present so the dev server runs over
// HTTPS — required for the camera (getUserMedia) to work over a LAN IP.
const keyPath = path.resolve(__dirname, '../certs/key.pem');
const certPath = path.resolve(__dirname, '../certs/cert.pem');
const https =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }
    : undefined;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose on LAN (0.0.0.0) so other devices can connect
    port: 5173,
    https,
  },
});
