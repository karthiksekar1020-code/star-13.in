# Estuary Dreamz BOATEL and Destiny DreamZ Villa: static website

A premium, **frontend-only** website for two Puducherry properties. Plain HTML, CSS and JavaScript.
**No server, no database, no login, no API, no environment variables.** The finished site is the `out/`
folder: upload it to any static host.

## Deploy (the short version)

Upload **everything inside `out/`** (including the hidden `.htaccess` file) to the root of your domain.

### Hostinger
1. **Back up the current star13.in first** (hPanel > Files > Backups, or download `public_html`). Uploading replaces the existing site.
2. hPanel > **Websites > Manage > File Manager > `public_html`**. Delete the old site's files.
3. Upload the **contents** of `out/` (not the `out` folder itself) into `public_html`. Zip `out/` on your PC, upload the zip, and use **Extract** if you prefer. Make sure `.htaccess` is included (File Manager > Settings > "Show hidden files").
4. Open https://star13.in/ and click through the pages. Enable the free SSL in hPanel if the site is not already HTTPS.

Plain Hostinger shared hosting is enough. No PHP, Node.js or database is needed.

### Vercel
1. Put this project folder in a GitHub repository (or use the Vercel CLI: `npm i -g vercel`, then `vercel --prod`).
2. Vercel > **Add New > Project** > import the repo. `vercel.json` already sets everything:
   build command `node build.js`, output directory `out`, trailing slashes on.
3. Deploy, then add your domain under **Settings > Domains**. No environment variables to set.

Alternative (no build on Vercel): run `npm run build` here, then deploy the `out/` folder with `vercel --prod out`.

## Changing the website

All text, rooms, facilities, photos list, contact details and the Villa page content live in **`src/data.js`**.
Page layouts are in `src/templates.js`, styles in `public/css/site.css`, behaviour in `public/js/site.js`,
photos in `public/img/`.

```
npm run build     # regenerates out/ from src/ and public/   (needs Node.js 18+, only on your PC)
npm run verify    # audits out/: every link, image, anchor, heading, alt text, no backend references
npm test          # build + verify
npm run preview   # optional: look at out/ at http://127.0.0.1:8080 before uploading
```

Edit, run `npm run build`, upload `out/` again. Node.js is only needed on the computer where you rebuild;
the website itself needs nothing but a static host. All internal links are root-relative (`/about/`), so the
site must sit at the root of a domain (star13.in), not in a sub-folder.

## What the site contains

Home, About, Rooms, Facilities, Experiences, Gallery (filters + lightbox), Location (map + directions),
Contact, Booking Enquiry, and **Destiny DreamZ Villa** at `/destiny-dreamz-villa/`, reachable from the
**Our Businesses** menu. Phone, WhatsApp, email, Google Maps and directions links all work without a server.

### Enquiry forms (no backend)
The booking and contact forms are checked in the browser, then open **WhatsApp** or the visitor's **email app**
with the details already written, ready to send. Nothing is stored or sent by this website, and it never claims a
booking is confirmed. You receive enquiries on the WhatsApp number and email in `src/data.js`.

## Content to confirm (`src/data.js`)

- **Rooms**: two placeholders named after the photos; no capacity or price is published anywhere on the original sites.
- **Facilities**: copied from the original site's data (WiFi, parking, boating, riverfront deck, family rooms, spa,
  conference room, pool, A/C rooms, dining). Remove any that are not accurate.
- **Reviews**: none shown. Add real, verified reviews to the `testimonials` list and a reviews section appears on the home page.
- **Villa email**: the Villa site shows `info@destinydreamzvilla.com` in its footer but the BOATEL email in its contact section.
- **`site_url`** is `https://star13.in` (used for canonical links, sitemap and share previews).

## Removed in the static conversion

Express-style Node server (`server.js`), SQLite database (`node:sqlite`, `data/`), admin login and sessions
(scrypt, cookies, rate limiting), the staff Portal (`portal/`) and its admin API (`/api/*`), booking and contact
enquiry storage, image upload, per-room dynamic pages (`/rooms/:id`), the Reviews page (needs a database),
the end-to-end server test suite, and every environment variable (`PORT`, `HOST`, `ADMIN_USER`, `ADMIN_PASSWORD`,
`TRUST_PROXY`, `BOATEL_DATA`). There are no runtime dependencies and no `node_modules`.

## Project layout

```
src/data.js            all content (edit this)
src/templates.js       page templates
build.js               generates out/
public/                css, js, img, .htaccess  (copied into out/)
scripts/verify.js      audits out/
scripts/preview.js     optional local preview (dev only, not deployed)
vercel.json            Vercel settings
out/                   the finished website: this is what you upload
```
