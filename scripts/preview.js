'use strict';
// LOCAL PREVIEW ONLY: serves the ./out folder so you can look at the site before uploading it.
// It is a development convenience, not part of the website, and is never uploaded.
// Usage: node scripts/preview.js [port]   ->   http://127.0.0.1:8080
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const PORT = Number(process.argv[2] || 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  let file = path.join(OUT, p);
  if (!file.startsWith(OUT)) { res.writeHead(403); return res.end(); }
  // behave like a typical static host: /about -> /about/ -> about/index.html
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      return fs.readFile(path.join(OUT, '404.html'), (e2, nf) => { res.writeHead(404, { 'Content-Type': TYPES['.html'] }); res.end(nf || 'Not found'); });
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => console.log('Previewing out/ at http://127.0.0.1:' + PORT));
