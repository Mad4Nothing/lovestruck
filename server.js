process.env.NODE_ENV = process.env.NODE_ENV || 'production';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve client directory
let clientDir = path.resolve(__dirname, 'dist/client');
if (!fs.existsSync(clientDir)) {
	clientDir = path.resolve(__dirname, 'dist/apps/web/client');
}

// Resolve server build file
let serverBuildPath = path.resolve(__dirname, 'dist/server/index.js');
if (!fs.existsSync(serverBuildPath)) {
	serverBuildPath = path.resolve(__dirname, 'dist/apps/web/server/index.js');
}

// Resolve public folder
let publicDir = path.resolve(__dirname, 'apps/web/public');
if (!fs.existsSync(publicDir)) {
	publicDir = path.resolve(__dirname, 'public');
}

console.log(`[Lovestruck] Node environment: ${process.env.NODE_ENV}`);
console.log(`[Lovestruck] Client directory: ${clientDir}`);
console.log(`[Lovestruck] Server build: ${serverBuildPath}`);

// Dynamically import dependencies AFTER setting NODE_ENV to production
const { default: express } = await import('express');
const { default: compression } = await import('compression');
const { createRequestHandler } = await import('@react-router/express');
const serverBuild = await import(pathToFileURL(serverBuildPath).href);

const app = express();
app.disable('x-powered-by');
app.use(compression());

// 1. Serve static /assets with 1-year immutable caching
app.use(
	'/assets',
	express.static(path.join(clientDir, 'assets'), {
		immutable: true,
		maxAge: '1y',
	}),
);

// 2. Serve static files from client build
app.use(express.static(clientDir, { maxAge: '1h' }));

// 3. Serve public directory assets (logos, images, manifests)
if (fs.existsSync(publicDir)) {
	app.use(express.static(publicDir, { maxAge: '1h' }));
}

// 4. Handle all SSR requests with React Router
app.all(
	'/{*splat}',
	createRequestHandler({
		build: serverBuild,
		mode: process.env.NODE_ENV,
	}),
);

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
	console.log(`[Lovestruck] Server listening on http://${host}:${port}`);
});
