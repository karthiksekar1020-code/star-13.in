'use strict';
/*
  Audits the generated ./out folder:  node scripts/verify.js   (or: npm test)
  Checks every page for structure, every internal link / image / script / stylesheet for a real target,
  in-page anchors, and that no backend, database or secret reference is left anywhere.
*/
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
let pass = 0, fail = 0;
const ok = (cond, name, extra) => {
  if (cond) pass++; else { fail++; console.log('  FAIL ' + name + (extra ? '  -> ' + extra : '')); }
};

if (!fs.existsSync(OUT)) { console.error('out/ not found. Run "npm run build" first.'); process.exit(1); }

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const files = walk(OUT);
const rel = (f) => path.relative(OUT, f).split(path.sep).join('/');
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// ---- required files ----
for (const f of ['index.html', '404.html', 'sitemap.xml', 'robots.txt', '.htaccess', 'css/site.css', 'js/site.js', 'img/logo.png']) {
  ok(fs.existsSync(path.join(OUT, f)), 'required file present: ' + f);
}

// ---- resolve a root-relative URL to a file inside out/ ----
function resolve(url) {
  const clean = url.split('#')[0].split('?')[0];
  let decoded; try { decoded = decodeURIComponent(clean); } catch { return null; }
  const target = decoded.endsWith('/') ? decoded + 'index.html' : decoded;
  const full = path.join(OUT, target);
  if (!full.startsWith(OUT)) return null;
  return fs.existsSync(full) && fs.statSync(full).isFile() ? full : null;
}
const idsCache = new Map();
const idsOf = (file) => {
  if (!idsCache.has(file)) idsCache.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])));
  return idsCache.get(file);
};

const FORBIDDEN = [/\/api\//i, /\/portal/i, /localhost/i, /127\.0\.0\.1/, /\bfetch\s*\(/, /XMLHttpRequest/, /supabase/i, /firebase/i, /process\.env/, /\bsocket\.io\b/i, /<form[^>]*\saction=/i];
let linkCount = 0, assetCount = 0;

for (const f of htmlFiles) {
  const name = rel(f);
  const html = fs.readFileSync(f, 'utf8');
  ok(/<html[^>]*\blang="/.test(html), `${name}: html lang`);
  ok(/<title>[^<]{5,}<\/title>/.test(html), `${name}: has a title`);
  if (name !== '404.html') {
    ok(/<meta name="description" content="[^"]{30,}"/.test(html), `${name}: has a meta description`);
    ok(/<link rel="canonical" href="https:\/\/[^"]+\/"/.test(html), `${name}: canonical URL ends with /`);
    ok(/<meta property="og:image"/.test(html), `${name}: Open Graph image`);
  }
  ok((html.match(/<h1[ >]/g) || []).length === 1, `${name}: exactly one h1`);
  const noAlt = html.match(/<img(?![^>]*\balt=)[^>]*>/g) || [];
  ok(noAlt.length === 0, `${name}: every image has alt text`, noAlt[0]);
  for (const re of FORBIDDEN) ok(!re.test(html), `${name}: no backend reference ${re}`);

  // links, images, scripts, stylesheets
  for (const m of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    const url = m[2];
    if (!url || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(url) || url.startsWith('//')) continue;
    if (url.startsWith('#')) {
      ok(url === '#' || idsOf(f).has(url.slice(1)), `${name}: in-page anchor ${url}`);
      continue;
    }
    if (!url.startsWith('/')) { ok(false, `${name}: relative URL not allowed (use root-relative)`, url); continue; }
    const target = resolve(url);
    const isAsset = m[1] === 'src' || /\.(css|png|jpe?g|avif|webp|svg|ico|js)(\?|$)/i.test(url);
    if (isAsset) assetCount++; else linkCount++;
    ok(!!target, `${name}: ${m[1]} ${url} exists`);
    if (target && url.includes('#') && target.endsWith('.html')) ok(idsOf(target).has(url.split('#')[1]), `${name}: anchor in ${url}`);
    if (!isAsset && !url.split('?')[0].endsWith('/') && !/\.\w+$/.test(url.split('?')[0])) ok(false, `${name}: internal page link should end with "/"`, url);
  }
}

// ---- css url() targets, js and css for backend references ----
for (const f of files.filter((x) => x.endsWith('.css'))) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    if (/^(https?:|data:)/.test(m[1])) continue;
    ok(m[1].startsWith('/') ? !!resolve(m[1]) : true, `${rel(f)}: url(${m[1]}) exists`);
  }
}
for (const f of files.filter((x) => /\.(js|css)$/.test(x))) {
  const src = fs.readFileSync(f, 'utf8');
  for (const re of [/\/api\//, /\/portal/i, /supabase/i, /firebase/i, /process\.env/, /\bfetch\s*\(/, /XMLHttpRequest/]) ok(!re.test(src), `${rel(f)}: no backend reference ${re}`);
}

// ---- nothing that looks like a backend, database or secret is shipped ----
const bad = files.filter((f) => /\.(db|sqlite|sqlite3|env|pem|key)$|^\.env|server\.js$|package(-lock)?\.json$|node_modules/.test(rel(f)) || rel(f).startsWith('data/') || rel(f).startsWith('portal/') || rel(f).startsWith('lib/'));
ok(bad.length === 0, 'no backend/database/secret files in out/', bad.map(rel).join(', '));

// ---- sitemap matches the pages ----
const sm = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8');
for (const m of sm.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)) ok(!!resolve(m[1]), `sitemap entry exists: ${m[1]}`);

const size = files.reduce((n, f) => n + fs.statSync(f).size, 0);
console.log(`Checked ${htmlFiles.length} HTML pages, ${linkCount} page links, ${assetCount} assets, ${files.length} files (${(size / 1048576).toFixed(1)} MB)`);
console.log(`${pass} checks passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
