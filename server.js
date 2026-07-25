/*
 * FR : Ce serveur statique minimal exécute les modules ES sans dépendance externe.
 * EN: This minimal static server runs ES modules without external dependencies.
 */

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const defaultPort = Number(process.env.PORT) || 4177;
const defaultHost = '127.0.0.1';

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8']
]);

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
};

export function createStaticServer(directory = projectRoot) {
  const rootDirectory = resolve(directory);

  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', `http://${request.headers.host || defaultHost}`);
      const pathname = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
      const requestedPath = resolve(rootDirectory, `.${pathname}`);

      // FR : Le préfixe résolu bloque les chemins qui tenteraient de quitter le projet.
      // EN: The resolved prefix blocks paths that would attempt to leave the project.
      if (requestedPath !== rootDirectory && !requestedPath.startsWith(`${rootDirectory}${sep}`)) {
        response.writeHead(403, securityHeaders);
        response.end('Forbidden');
        return;
      }

      const fileStats = await stat(requestedPath);

      if (!fileStats.isFile()) {
        throw new Error('Not a file');
      }

      const extension = extname(requestedPath).toLowerCase();
      response.writeHead(200, {
        ...securityHeaders,
        'Content-Type': mimeTypes.get(extension) || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      createReadStream(requestedPath).pipe(response);
    } catch {
      response.writeHead(404, securityHeaders);
      response.end('Not found');
    }
  });
}

export function startServer({ port = defaultPort, host = defaultHost } = {}) {
  const server = createStaticServer();

  server.listen(port, host, () => {
    console.log(`Synth Survey is running at http://${host}:${port}`);
  });

  return server;
}

// FR : L'import du module par les tests ne démarre pas automatiquement le serveur.
// EN: Importing the module in tests does not start the server automatically.
if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  startServer();
}
