import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import customersRoutes from './modules/customers/customers.routes.js';
import billpayRoutes from './modules/billpay/billpay.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
// env.corsOrigin may be '*' or a comma-separated list; see config/env.js.
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/billpay', billpayRoutes);

app.use(notFound);
app.use(errorHandler);

// Serve over HTTPS when enabled and certs are available (needed so the
// browser camera works over a LAN IP); otherwise fall back to HTTP.
if (env.https.enabled && env.https.keyPath && env.https.certPath) {
  const options = {
    key: fs.readFileSync(env.https.keyPath),
    cert: fs.readFileSync(env.https.certPath),
  };
  https.createServer(options, app).listen(env.port, '0.0.0.0', () => {
    console.log(`[server] Listening on https://0.0.0.0:${env.port}`);
  });
} else {
  http.createServer(app).listen(env.port, '0.0.0.0', () => {
    console.log(`[server] Listening on http://0.0.0.0:${env.port}`);
  });
}

export default app;
