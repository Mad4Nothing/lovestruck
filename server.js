import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Target the production server build (supporting both dist/server and dist/apps/web/server)
const serverBuild = fs.existsSync(path.resolve(__dirname, 'dist/server/index.js'))
	? path.resolve(__dirname, 'dist/server/index.js')
	: path.resolve(__dirname, 'dist/apps/web/server/index.js');

process.argv[2] = serverBuild;

// Start React Router production server CLI directly
const cliPath = path.resolve(__dirname, 'node_modules/@react-router/serve/dist/cli.js');
await import(pathToFileURL(cliPath).href);
