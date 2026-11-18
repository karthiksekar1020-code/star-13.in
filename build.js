'use strict';
/*
  Static site generator. Reads src/data.js + src/templates.js and writes a complete website into ./out
  (plain HTML, CSS, JS and images). No server, database or environment variables are needed to run
  the result: upload the contents of `out/` to any static host.

  Usage:  node build.js        (or: npm run build)
  Needs only Node.js 18 or newer, and only on the machine that builds.
*/
const fs = require('fs');
const path = require('path');
const { render, esc } = require('./src/templates');
const { content: c } = require('./src/data');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'out');
const PUBLIC = path.join(ROOT, 'public');

// every page that gets generated (each becomes <route>/index.html so it works at /route/ on any host)
const PAGES = ['/', '/about', '/rooms', '/facilities', '/experiences', '/gallery', '/location', '/contact', '/booking', '/destiny-dreamz-villa'];
const ROUTE_RE = new RegExp('href="(/(?:' + PAGES.filter((p) => p !== '/').map((p) => p.slice(1)).join('|') + '))(?=["?#])', 'g');

// safety: only ever delete the ./out folder inside this project
if (path.dirname(OUT) !== ROOT || path.basename(OUT) !== 'out') throw new Error('Refusing to clean unexpected folder: ' + OUT);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 1. static assets (css, js, img, .htaccess)
fs.cpSync(PUBLIC, OUT, { recursive: true });

// 2. pages
let count = 0;
for (const p of PAGES) {
  let html = render(p);
  if (html == null) throw new Error('No template for ' + p);
  html = html.replace(ROUTE_RE, 'href="$1/'); // internal links end in "/" so they resolve on every static host
  const file = p === '/' ? path.join(OUT, 'index.html') : path.join(OUT, p.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  count++;
}

// 3. 404 page
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found | ${esc(c.site_name)}</title><meta name="robots" content="noindex">
<link rel="icon" type="image/png" href="/img/logo.png"><link rel="stylesheet" href="/css/site.css"></head>
<body><main class="nf"><img src="/img/logo.png" width="90" alt=""><h1>Page not found</h1><p>The page you are looking for does not exist.</p><a class="btn btn-gold" href="/">Back to home</a></main></body></html>
`);

// 4. sitemap + robots
const site = c.site_url.replace(/\/$/, '');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map((p) => `  <url><loc>${site}${p === '/' ? '/' : p + '/'}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);

console.log(`Built ${count} pages + 404, sitemap and robots into ${path.relative(ROOT, OUT)}/`);
