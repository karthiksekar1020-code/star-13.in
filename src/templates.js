'use strict';
// Page templates. Pure functions: data in (./data.js), HTML string out. Used only at build time by build.js.
const data = require('./data');
const getContent = () => data.content;

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const paras = (s) => String(s || '').split(/\n{2,}/).map((p) => `<p>${esc(p.trim())}</p>`).join('');
const telHref = (s) => 'tel:' + String(s).replace(/[^\d+]/g, '');

const ICONS = {
  snow: '<path d="M12 2v20M4 6l16 12M20 6 4 18M9 3l3 3 3-3M9 21l3-3 3 3"/>',
  pool: '<path d="M3 16c2 0 2-1.5 4.5-1.5S10 16 12 16s2-1.5 4.5-1.5S19 16 21 16M3 20c2 0 2-1.5 4.5-1.5S10 20 12 20s2-1.5 4.5-1.5S19 20 21 20M8 12V5a2 2 0 0 1 4 0M14 12V5a2 2 0 0 1 4 0M8 8h6"/>',
  deck: '<path d="M3 18h18M5 18V9m14 9V9M3 9h18M8 9V5h8v4"/>',
  boat: '<path d="M2 17l2.5 4h15L22 17H2zM12 3v10M12 4l6 8h-6M12 6 7 12h5"/>',
  spa: '<path d="M12 21c-4 0-8-3-8-8 4 0 8 2 8 8zM12 21c4 0 8-3 8-8-4 0-8 2-8 8zM12 14c-2-2-2-6 0-10 2 4 2 8 0 10z"/>',
  dining: '<path d="M6 3v8a2 2 0 0 0 2 2v8M10 3v8a2 2 0 0 1-2 2M8 3v6M17 21V3c-2 1-3 4-3 8h3"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1"/>',
  car: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M9 17h6M3 12h18"/>',
  family: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M2 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M15 14.5a4 4 0 0 1 7 2.5v3"/>',
  meeting: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  whatsapp: '<path d="M20 11.5A8.5 8.5 0 0 1 7.6 19L3 20.5 4.5 16A8.5 8.5 0 1 1 20 11.5z"/><path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.2-1.3-1.8-1-.9.7a4 4 0 0 1-1.8-1.8l.7-.9-1-1.8z"/>',
  directions: '<path d="M12 3 3 12l9 9 9-9-9-9z"/><path d="M8.5 14v-2.5a2 2 0 0 1 2-2H15m0 0-2-2m2 2-2 2"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'
};
const icon = (n, size = 26) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.star}</svg>`;

const NAV = [
  ['/about', 'About'], ['/rooms', 'Rooms'], ['/facilities', 'Facilities'], ['/experiences', 'Experiences'],
  ['/gallery', 'Gallery'], ['/location', 'Location'], ['/contact', 'Contact']
];

// "Our Businesses": the properties run under the Star13 brand. Each opens its own internal page.
const BUSINESSES = [
  { href: '/', name: 'Estuary Dreamz BOATEL', note: 'Waterfront BOATEL' },
  { href: '/destiny-dreamz-villa', name: 'Destiny DreamZ Villa', note: 'Premium villa stay' }
];
const bizMenu = (path) => {
  const active = BUSINESSES.some((b) => b.href !== '/' && path === b.href);
  return `<li class="has-sub">
    <button type="button" class="sub-btn${active ? ' on' : ''}" aria-expanded="false" aria-controls="biz-menu" id="biz-btn">Our Businesses
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
    <ul class="sub" id="biz-menu" aria-labelledby="biz-btn">${BUSINESSES.map((b) =>
      `<li><a href="${b.href}"${path === b.href ? ' aria-current="page"' : ''}><b>${esc(b.name)}</b><small>${esc(b.note)}</small></a></li>`).join('')}</ul>
  </li>`;
};

// Each business has its own identity (logo, name, menu, contact) in the header, footer and tab.
function brandFor(c, key) {
  if (key === 'villa') {
    return {
      key, siteName: 'Destiny DreamZ Villa', logo: '/img/villa/logo.jpg', logoW: 76, logoH: 46, icon: 'image/jpeg',
      title1: 'Destiny DreamZ', title2: 'Villa', home: '/destiny-dreamz-villa/', themeColor: '#0f2a21',
      whatsapp: c.villa_whatsapp, address: c.villa_address, phones: [c.villa_phone_1, c.villa_phone_2, c.villa_phone_3].filter(Boolean),
      email: c.villa_email, lat: c.villa_latitude, lng: c.villa_longitude, cta: ['#villa-enquiry', 'Book Enquiry'],
      note: 'Rates, availability and arrangements are confirmed directly by the front desk.',
      nav: [['#villa-about', 'About'], ['#villa-why', 'Highlights'], ['#villa-gallery', 'Gallery'], ['#villa-activities', 'Activities'], ['#villa-nearby', 'Nearby'], ['#villa-enquiry', 'Contact']],
      explore: [['#villa-about', 'About the villa'], ['#villa-gallery', 'Gallery'], ['#villa-nearby', 'Nearby places'], ['#villa-enquiry', 'Booking enquiry']]
    };
  }
  return {
    key: 'boatel', siteName: c.site_name, logo: '/img/logo.png', logoW: 52, logoH: 45, icon: 'image/png',
    title1: 'Estuary Dreamz', title2: 'BOATEL', home: '/', themeColor: '#0e2037',
    whatsapp: c.whatsapp, address: c.address, phones: [c.phone_1, c.phone_2, c.phone_3].filter(Boolean),
    email: c.email, lat: c.latitude, lng: c.longitude, cta: ['/booking', 'Book Enquiry'], note: c.footer_note,
    nav: NAV, explore: NAV.concat([['/booking', 'Booking Enquiry']])
  };
}

function layout({ title, desc, path, body, c, image, jsonld, biz }) {
  const B = brandFor(c, biz);
  const site = c.site_url.replace(/\/$/, '');
  const url = site + (path === '/' ? '/' : path + '/');
  const img = site + (image || '/img/front-view.jpg');
  const links = B.nav.map(([h, t]) =>
    `<li><a href="${h}"${B.key === 'boatel' && (path === h || (h !== '/' && path.startsWith(h + '/'))) ? ' aria-current="page"' : ''}>${t}</a></li>`).join('') + bizMenu(path);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(B.siteName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${B.themeColor}">
<link rel="icon" type="${B.icon}" href="${B.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">
<script>document.documentElement.classList.add('js')</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body class="${B.key === 'villa' ? 'villa-page' : ''}">
<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="nav">
  <div class="nav-in">
    <a class="brand${B.key === 'villa' ? ' brand-villa' : ''}" href="${B.home}" aria-label="${esc(B.siteName)} home">
      <img src="${B.logo}" width="${B.logoW}" height="${B.logoH}" alt="">
      <span><b>${esc(B.title1)}</b><small>${esc(B.title2)}</small></span>
    </a>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i><i></i><i></i></button>
    <nav id="menu" aria-label="Main">
      <ul>${links}
        <li class="nav-cta nav-cta-m"><a class="btn btn-gold sm" href="${B.cta[0]}">${B.cta[1]}</a></li>
        <li class="nav-other-m"><span>Visit Our Another Hotel</span>${B.key === 'villa' ? `<a href="/"><img src="/img/logo.png" width="52" height="45" alt=""><b>Estuary Dreamz</b><small>BOATEL</small></a>` : `<a href="/destiny-dreamz-villa/"><img src="/img/villa/logo.jpg" width="76" height="46" alt=""><b>Destiny Dreamz</b><small>Villa</small></a>`}</li>
      </ul>
    </nav>
    <div class="nav-right">${B.key === 'boatel' ? `
      <a class="nav-villa" href="/destiny-dreamz-villa/" aria-label="Destiny DreamZ Villa" title="Destiny DreamZ Villa"><span class="nv-cap">Visit Our Another Hotel</span><img src="/img/villa/logo.jpg" width="76" height="46" alt=""><span class="nv-name"><b>Destiny Dreamz</b><small>Villa</small></span></a>` : `
      <a class="nav-villa" href="/" aria-label="Estuary Dreamz BOATEL" title="Estuary Dreamz BOATEL"><span class="nv-cap">Visit Our Another Hotel</span><img src="/img/logo.png" width="52" height="45" alt=""><span class="nv-name"><b>Estuary Dreamz</b><small>BOATEL</small></span></a>`}
      <span class="nav-cta nav-cta-desk"><a class="btn btn-gold sm" href="${B.cta[0]}">${B.cta[1]}</a></span>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
${footer(c, B)}
<a class="fab fab-wa" href="https://wa.me/${esc(B.whatsapp)}?text=${encodeURIComponent('Hello ' + B.siteName + ', I would like to make an enquiry.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5A8.5 8.5 0 0 1 7.6 19L3 20.5 4.500 16A8.500 8.500 0 1 1 20 11.500z"/><path d="M9 9.500c.5 2.500 2.500 4.500 5 5l1.200-1.300-1.800-1-.9.700a4 4 0 0 1-1.800-1.800l.7-.9-1-1.800z"/></svg>
</a>
<script src="/js/site.js" defer></script>
</body>
</html>`;
}

function footer(c, B) {
  return `<footer class="footer">
  <div class="wrap foot-grid">
    <div>
      <a class="brand${B.key === 'villa' ? ' brand-villa' : ''}" href="${B.home}"><img src="${B.logo}" width="${B.logoW}" height="${B.logoH}" alt=""><span><b>${esc(B.title1)}</b><small>${esc(B.title2)}</small></span></a>
      <p class="foot-note">${esc(B.note)}</p>
    </div>
    <div>
      <h3>Explore</h3>
      <ul>${B.explore.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Our Businesses</h3>
      <ul>${BUSINESSES.map((x) => `<li><a href="${x.href}">${esc(x.name)}</a></li>`).join('')}</ul>
      <h3 class="foot-sub">Contact</h3>
      <ul class="contact-list">
        <li><span class="ci">${icon('pin', 18)}</span><a href="https://www.google.com/maps/dir/?api=1&destination=${esc(B.lat)},${esc(B.lng)}" target="_blank" rel="noopener">${esc(B.address)}</a></li>
        ${B.phones.map((p) => `<li><span class="ci">${icon('phone', 18)}</span><a href="${telHref(p)}">${esc(p)}</a></li>`).join('')}
        <li><span class="ci">${icon('mail', 18)}</span><a href="mailto:${esc(B.email)}">${esc(B.email)}</a></li>
        <li><span class="ci">${icon('whatsapp', 18)}</span><a href="https://wa.me/${esc(B.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></li>
        <li><span class="ci">${icon('directions', 18)}</span><a href="https://www.google.com/maps/dir/?api=1&destination=${esc(B.lat)},${esc(B.lng)}" target="_blank" rel="noopener">Get directions</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap foot-base">
    <span>&copy; ${new Date().getFullYear()} ${esc(B.siteName)}, Puducherry. All rights reserved.</span>
  </div>
</footer>`;
}

const heading = (eyebrow, title, lead) => `
<div class="head reveal">
  ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
  <h2>${esc(title)}</h2>
  ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
</div>`;

const pageHero = (title, sub, img) => `
<section class="page-hero">
  <img src="${esc(img || '/img/building-1.jpg')}" alt="" fetchpriority="high">
  <div class="page-hero-in wrap"><span class="eyebrow">Estuary Dreamz BOATEL</span><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
</section>`;

function roomCard(r) {
  return `<article class="room-card reveal">
  <div class="room-img"><img src="${esc(r.image)}" alt="${esc(r.name)} at Estuary Dreamz BOATEL" loading="lazy" width="800" height="600"></div>
  <div class="room-body">
    <h3>${esc(r.name)}</h3>
    <p>${esc(r.description)}</p>
    ${r.features ? `<ul class="chips">${r.features.split(',').map((f) => `<li>${esc(f.trim())}</li>`).join('')}</ul>` : ''}
    <div class="room-meta">
      <span>${r.capacity ? esc(r.capacity) : 'Capacity on request'}</span>
      <span class="price">${r.price ? esc(r.price) : 'Rates on enquiry'}</span>
    </div>
    <div class="room-actions">
      <a class="btn btn-gold sm" href="/booking?room=${encodeURIComponent(r.name)}">Enquire</a>
    </div>
  </div>
</article>`;
}

const facilityCard = (f) => `<div class="fac fac-media reveal">
  <div class="fac-pic${f.image ? '' : ' no-photo'}">${f.image
    ? `<img src="${esc(f.image)}" alt="${esc(f.imageAlt || f.name)}" loading="lazy" width="640" height="400"><span class="fac-badge">${icon(f.icon, 22)}</span>`
    : `<span class="fac-ic big">${icon(f.icon, 46)}</span>`}</div>
  <div class="fac-body"><h3>${esc(f.name)}</h3><p>${esc(f.description)}</p></div>
</div>`;

const galleryItem = (g, i) => `<figure class="g-item" data-cat="${esc(g.category)}">
  <button type="button" class="g-btn" data-index="${i}" aria-label="Open photo: ${esc(g.caption || g.category)}">
    <img src="${esc(g.image)}" alt="${esc(g.caption || 'Estuary Dreamz BOATEL photo')}" loading="lazy">
  </button>
  ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}
</figure>`;

const stars = (n) => '\u2605'.repeat(Math.max(0, Math.min(5, n))) + '\u2606'.repeat(5 - Math.max(0, Math.min(5, n)));
const testimonialCard = (t) => `<blockquote class="quote reveal">
  <div class="stars" aria-label="${t.rating} out of 5 stars">${stars(t.rating)}</div>
  <p>${esc(t.text)}</p>
  <footer>${esc(t.name)}${t.source ? ` <span>· ${esc(t.source)}</span>` : ''}</footer>
</blockquote>`;

const mapEmbed = (c) => `<iframe title="Estuary Dreamz BOATEL on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
  src="https://www.google.com/maps?q=${encodeURIComponent(c.latitude + ',' + c.longitude)}&z=15&output=embed"></iframe>`;

const NEARBY = [
  { name: 'Eden Beach', img: '/img/eden-beach.jpg', text: 'Blue Flag beach known for cleanliness, lifeguards, and family-friendly facilities.' },
  { name: 'Chunnambar Boat House', img: '/img/chunnambar.jpg', text: 'Backwater cruises, boating, and ferry access \u2014 a relaxing way to enjoy the estuary and mangroves.' },
  { name: 'White Town & Promenade', img: '/img/white-town.jpg', text: 'French Quarter\u2019s colonial architecture, cafes, and a scenic seaside promenade.' },
  { name: 'Arikamedu Archaeological Site', img: '/img/arikamedu.jpg', text: 'Ancient Roman trade settlement remnants; a serene spot for history lovers and photographers.' }
];

// Static enquiry form: no server. site.js validates it and opens WhatsApp or the visitor's email app with the details filled in.
function bookingForm(c, rooms, selected, opts = {}) {
  const property = opts.property || c.site_name;
  const wa = opts.wa || c.whatsapp;
  const email = opts.email || c.email;
  return `<form class="form" id="bookingForm" novalidate data-property="${esc(property)}" data-wa="${esc(wa)}" data-email="${esc(email)}">
  <div class="f-row">
    <label>Full name<input id="b_name" name="name" type="text" autocomplete="name" required maxlength="100"></label>
    <label>Phone number<input id="b_phone" name="phone" type="tel" autocomplete="tel" required maxlength="20" placeholder="+91 ..."></label>
  </div>
  <label>Email address<input id="b_email" name="email" type="email" autocomplete="email" required maxlength="150"></label>
  <div class="f-row three">
    <label>Check-in<input id="b_in" name="check_in" type="date" required></label>
    <label>Check-out<input id="b_out" name="check_out" type="date" required></label>
    <label>Guests<input id="b_guests" name="guests" type="number" min="1" max="20" value="2" required></label>
  </div>
  ${rooms.length ? `<label>Room preference
    <select id="b_room" name="room">
      <option value="">No preference</option>
      ${rooms.map((r) => `<option${r.name === selected ? ' selected' : ''}>${esc(r.name)}</option>`).join('')}
    </select>
  </label>` : ''}
  <label>Special requests<textarea id="b_msg" name="message" rows="4" maxlength="1500"></textarea></label>
  <p class="form-note">Choose how to send your enquiry. Your details open in WhatsApp or your email app, ready to send. This is an enquiry, not a confirmed booking: the front desk will confirm availability and rates.</p>
  <div class="form-actions">
    <button class="btn btn-gold" type="submit" value="wa">Send via WhatsApp</button>
    <button class="btn btn-line dark" type="submit" value="email">Send by Email</button>
  </div>
  <div class="form-status" id="bookingStatus" role="status" aria-live="polite"></div>
</form>`;
}

function contactBlock(c) {
  return `<ul class="contact-cards">
  <li><span>${icon('pin', 22)}</span><div><h3>Address</h3><p>${esc(c.address)}</p></div></li>
  <li><span>${icon('phone', 22)}</span><div><h3>Phone</h3><p><a href="${telHref(c.phone_1)}">${esc(c.phone_1)}</a><br><a href="${telHref(c.phone_2)}">${esc(c.phone_2)}</a><br><a href="${telHref(c.phone_3)}">${esc(c.phone_3)}</a></p></div></li>
  <li><span>${icon('mail', 22)}</span><div><h3>Email</h3><p><a href="mailto:${esc(c.email)}?subject=${encodeURIComponent('Enquiry - ' + c.site_name)}">${esc(c.email)}</a></p></div></li>
  <li><span>${icon('whatsapp', 22)}</span><div><h3>WhatsApp</h3><p><a href="https://wa.me/${esc(c.whatsapp)}?text=${encodeURIComponent('Hello ' + c.site_name + ', I would like to make an enquiry.')}" target="_blank" rel="noopener">Chat with the front desk</a></p></div></li>
</ul>`;
}

function hotelJsonLd(c, gallery) {
  const site = c.site_url.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org', '@type': 'Hotel', name: c.site_name, url: site + '/',
    image: gallery.slice(0, 4).map((g) => site + g.image),
    telephone: c.phone_1, email: c.email,
    address: { '@type': 'PostalAddress', streetAddress: c.address, addressLocality: 'Puducherry', postalCode: '605007', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: Number(c.latitude), longitude: Number(c.longitude) }
  };
}

// ---------- Destiny DreamZ Villa (second business, internal page) ----------
// Content reproduced from destiny-dream-z-villa.vercel.app; contact details live in src/data.js.
const VILLA_GALLERY = [
  ['front-view.jpg', 'Destiny DreamZ Villa, front view'], ['bedroom.avif', 'Bedroom'], ['dining.jpg', 'Dining area'],
  ['pool.jpg', 'Swimming pool'], ['pool-2.jpg', 'Swimming pool'], ['hall.jpg', 'Hall'], ['terrace.jpg', 'Terrace']
].map(([f, caption]) => ({ image: '/img/villa/' + f, caption, category: 'Villa' }));
const VILLA_ACTIVITIES = [
  { title: 'Beach walks & relaxation', text: 'Long shoreline and gentle waters make it perfect for a leisurely walk, relaxing on the sand, or simply watching the waves.',
    tips: ['Tip: Visit around sunrise or sunset for softer light and fewer crowds.', 'Bring a hat and sunscreen — coastal sun can be strong even during strolls.'] },
  { title: 'Swimming & beach games', text: 'Shallow stretches of water are great for comfortable swimming and playful time by the shore.',
    tips: ['Safety: Always check local conditions for waves.', 'Carry a Frisbee or ball for simple beach games.'] },
  { title: 'Observe traditional fishing', text: 'Catch a glimpse of local fishermen working with nets and small boats — a window into coastal life.',
    tips: ['Be respectful and keep a considerate distance while observing.', 'Mornings often offer the most activity along shore.'] }
];
const VILLA_NEARBY = [
  { name: 'Sacred Heart Basilica', img: '/img/villa/sacred-heart-basilica.jpg', text: 'Iconic Neo-Gothic church known for stunning stained-glass windows, peaceful ambience, and beautiful evening illuminations.' },
  { name: 'Botanical Garden', img: '/img/villa/botanical-garden.jpg', text: 'Historic garden featuring diverse flora, shaded walkways, and a relaxed setting—great for families and leisurely strolls.' },
  { name: 'Providence Mall', img: '/img/villa/providence-mall.jpg', text: 'Modern shopping and entertainment hub with popular brands, cinema, and a wide range of dining options.' },
  { name: 'White Town & Promenade Beach', img: '/img/white-town.jpg', text: 'French Quarter’s colonial architecture, cafes, and a scenic seaside promenade.' }
];
const VILLA_MAP = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.633032425007!2d79.82269587453179!3d11.930606736846592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361007efe50e1%3A0x384c3af8573b107a!2sDestiny%20Dreamz%20Villa!5e0!3m2!1sen!2sin!4v1762061345007!5m2!1sen!2sin';

function villaContact(c) {
  const wa = `https://wa.me/${esc(c.villa_whatsapp)}?text=${encodeURIComponent('Hello Destiny DreamZ Villa, I would like to make an enquiry.')}`;
  return `<ul class="contact-cards">
  <li><span>${icon('pin', 22)}</span><div><h3>Address</h3><p>Destiny DreamZ Villa<br>${esc(c.villa_address)}</p></div></li>
  <li><span>${icon('phone', 22)}</span><div><h3>Phone</h3><p>${[c.villa_phone_1, c.villa_phone_2, c.villa_phone_3].filter(Boolean).map((p) => `<a href="${telHref(p)}">${esc(p)}</a>`).join('<br>')}</p></div></li>
  <li><span>${icon('mail', 22)}</span><div><h3>Email</h3><p><a href="mailto:${esc(c.villa_email)}?subject=${encodeURIComponent('Enquiry - Destiny DreamZ Villa')}">${esc(c.villa_email)}</a></p></div></li>
  <li><span>${icon('whatsapp', 22)}</span><div><h3>WhatsApp</h3><p><a href="${wa}" target="_blank" rel="noopener">Chat with the front desk</a></p></div></li>
</ul>`;
}

function villaPage(c, wrap) {
  const site = c.site_url.replace(/\/$/, '');
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${esc(c.villa_latitude)},${esc(c.villa_longitude)}`;
  const wa = `https://wa.me/${esc(c.villa_whatsapp)}?text=${encodeURIComponent('Hello Destiny DreamZ Villa, I would like to make an enquiry.')}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Hotel', name: 'Destiny DreamZ Villa', url: site + '/destiny-dreamz-villa/',
    image: [site + '/img/villa/front-view.jpg'], telephone: c.villa_phone_1, email: c.villa_email,
    address: { '@type': 'PostalAddress', streetAddress: c.villa_address, addressLocality: 'Puducherry', postalCode: '605001', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: Number(c.villa_latitude), longitude: Number(c.villa_longitude) }
  };
  return wrap({
    biz: 'villa', title: 'Destiny DreamZ Villa | Premium Villa Stay in Puducherry',
    desc: `${c.villa_intro}`.slice(0, 160), image: '/img/villa/front-view.jpg', jsonld: ld,
    body: `<div class="villa">
<section class="v-hero" id="villa-home">
  <div class="wrap v-hero-in">
    <div class="v-hero-text">
      <span class="eyebrow">Puducherry · Our Businesses</span>
      <h1>Destiny DreamZ <em>Villa</em></h1>
      <p class="v-tag">${esc(c.villa_tagline)}</p>
      <p>${esc(c.villa_intro)}</p>
      <div class="hero-cta">
        <a class="btn btn-sun" href="#villa-enquiry">Booking Enquiry</a>
        <a class="btn btn-line" href="${telHref(c.villa_phone_1)}">${icon('phone', 16)}Call ${esc(c.villa_phone_1)}</a>
      </div>
      <div class="hero-links"><a href="${wa}" target="_blank" rel="noopener">${icon('whatsapp', 15)}WhatsApp</a><a href="${dir}" target="_blank" rel="noopener">${icon('directions', 15)}Directions</a><a href="#villa-gallery">${icon('star', 15)}Gallery</a></div>
      <a class="v-other" href="/" aria-label="Estuary Dreamz BOATEL"><span class="v-other-cap">Visit Our Another Hotel</span><span class="v-other-card"><img src="/img/logo.png" width="52" height="45" alt=""><span><b>Estuary Dreamz</b><small>BOATEL</small></span></span></a>
    </div>
    <div class="v-hero-photo">
      <img src="/img/villa/front-view.jpg" alt="Destiny DreamZ Villa front view" width="640" height="960" fetchpriority="high">
      <img class="v-logo-badge" src="/img/villa/logo.jpg" alt="Destiny DreamZ Villa logo" width="220" height="150">
    </div>
  </div>
</section>

<section class="section" id="villa-about">
  <div class="wrap split">
    <div class="split-text reveal">
      <span class="eyebrow">About</span>
      <h2>About Destiny DreamZ Villa</h2>
      ${paras(c.villa_about)}
      <a class="btn btn-sun dark-text" href="#villa-enquiry">Send an enquiry</a>
    </div>
    <div class="v-about-img reveal"><img src="/img/villa/logo.jpg" alt="Destiny DreamZ Villa logo" loading="lazy" width="540" height="368"></div>
  </div>
</section>

<section class="section v-sage" id="villa-why">
  <div class="wrap">
    ${heading('At the villa', 'Why stay here')}
    <div class="grid three">
      <div class="fac fac-v reveal"><span class="fac-photo"><img src="/img/villa/front-view.jpg" alt="Destiny DreamZ Villa front view" loading="lazy" width="640" height="420"></span><span class="fac-ic">${icon('deck')}</span><h3>Prime location near Promenade Beach</h3><p>Steps from Promenade Beach with quick access to the promenade, cafes, and top attractions.</p></div>
      <div class="fac fac-v reveal"><span class="fac-photo"><img src="/img/villa/bedroom.avif" alt="Comfortable air-conditioned bedroom at the villa" loading="lazy" width="640" height="420"></span><span class="fac-ic">${icon('snow')}</span><h3>Comfortable rooms &amp; modern amenities</h3><p>Air-conditioned rooms, cozy beds, high-speed Wi‑Fi, and smart TV for a relaxed stay.</p></div>
      <div class="fac fac-v reveal"><span class="fac-photo"><img src="/img/villa/dining.jpg" alt="Dining area at the villa" loading="lazy" width="640" height="420"></span><span class="fac-ic">${icon('dining')}</span><h3>Dining &amp; special occasions</h3><p>Curated dining experiences, and special packages for honeymoons, corporate retreats, and bespoke celebrations.</p></div>
    </div>
    <p class="center v-note">Room types and rates are confirmed by the front desk when you send an enquiry.</p>
  </div>
</section>

<section class="section" id="villa-gallery">
  <div class="wrap">
    ${heading('Gallery', 'Gallery of Destiny DreamZ Villa')}
    <div class="masonry" id="gallery">${VILLA_GALLERY.map(galleryItem).join('')}</div>
  </div>
</section>
<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
  <button class="lb-close" type="button" aria-label="Close">&times;</button>
  <button class="lb-prev" type="button" aria-label="Previous photo">&#8249;</button>
  <figure><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure>
  <button class="lb-next" type="button" aria-label="Next photo">&#8250;</button>
</div>

<section class="section v-forest" id="villa-activities">
  <div class="wrap">
    ${heading('Nearby', 'Top activities near the property')}
    <div class="grid three">${VILLA_ACTIVITIES.map((a, i) => `<article class="v-act reveal"><span class="v-num">${i + 1}</span><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><ul>${a.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></article>`).join('')}</div>
  </div>
</section>

<section class="section" id="villa-nearby">
  <div class="wrap">
    ${heading('Explore', 'Nearby places to visit')}
    <div class="grid exp-grid exp-4">${VILLA_NEARBY.map((n) => `<article class="exp reveal"><img src="${n.img}" alt="${esc(n.name)}" loading="lazy"><div><h3>${esc(n.name)}</h3><p>${esc(n.text)}</p></div></article>`).join('')}</div>
  </div>
</section>

<section class="section v-sage" id="villa-enquiry">
  <div class="wrap split">
    <div class="card-box reveal">
      <h2 class="v-form-title">Booking enquiry</h2>
      ${bookingForm(c, [], '', { property: 'Destiny DreamZ Villa', wa: c.villa_whatsapp, email: c.villa_email })}
    </div>
    <div class="reveal">
      ${heading('', 'Contact Us', 'We’d love to hear from you! Reach out for bookings, enquiries, or any special requests. Our team is dedicated to providing you with the best possible experience at Destiny DreamZ Villa.')}
      ${villaContact(c)}
      <div class="v-actions"><a class="btn btn-green" href="${telHref(c.villa_phone_1)}">${icon('phone', 16)}Call now</a><a class="btn btn-green" href="${wa}" target="_blank" rel="noopener">${icon('whatsapp', 16)}WhatsApp</a><a class="btn btn-line dark" href="${dir}" target="_blank" rel="noopener">${icon('directions', 16)}Directions</a></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="map big reveal"><iframe title="Destiny DreamZ Villa on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${VILLA_MAP}"></iframe></div>
  </div>
</section>

<section class="section cta-band">
  <div class="wrap center reveal">
    <h2>Also from our family of businesses</h2>
    <p class="lead">Prefer the water’s edge? Discover Estuary Dreamz BOATEL, Puducherry’s unique water-front BOATEL.</p>
    <a class="btn btn-gold" href="/">Estuary Dreamz BOATEL</a>
  </div>
</section>
</div>`
  });
}

// ---------- pages ----------
function render(path) {
  const c = getContent();
  const { rooms, facilities, gallery } = data;
  const reviews = data.testimonials;
  const name = c.site_name;
  const ld = hotelJsonLd(c, gallery);
  const wrap = (opts) => layout({ c, path, ...opts });

  if (path === '/destiny-dreamz-villa') return villaPage(c, wrap);
  if (path === '/') {
    return wrap({
      title: `${name} | Waterfront BOATEL in Puducherry`,
      desc: `${name} is Puducherry's unique water-front BOATEL beside the backwaters, near Eden Beach. Enquire about rooms, facilities and experiences.`,
      jsonld: ld,
      body: `
<section class="hero" id="home">
  <img class="hero-img" src="/img/front-view.jpg" alt="${esc(name)} front view" fetchpriority="high">
  <div class="hero-shade"></div>
  <div class="hero-in wrap">
    <span class="eyebrow">${esc(c.hero_eyebrow)}</span>
    <h1>${esc(c.hero_title)}</h1>
    <p>${esc(c.hero_text)}</p>
    <div class="hero-cta">
      <a class="btn btn-gold" href="/booking">Booking Enquiry</a>
      <a class="btn btn-line" href="/rooms">Explore Rooms</a>
    </div>
    <div class="hero-links">
      <a href="${telHref(c.phone_1)}">${icon('phone', 15)}Call ${esc(c.phone_1)}</a>
      <a href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp', 15)}WhatsApp</a>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${esc(c.latitude)},${esc(c.longitude)}" target="_blank" rel="noopener">${icon('directions', 15)}Directions</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="split-text reveal">
      <span class="eyebrow">Welcome</span>
      <h2>${esc(c.welcome_title)}</h2>
      <p class="lead">${esc(c.welcome_text)}</p>
      ${paras(c.about_text)}
      <a class="btn btn-gold dark-text" href="/about">About the property</a>
    </div>
    <div class="split-img reveal"><img src="/img/building-1.jpg" alt="The BOATEL building" loading="lazy"><img class="alt" src="/img/pool.jpg" alt="Swimming pool" loading="lazy"></div>
  </div>
</section>

<section class="section dark">
  <div class="wrap">
    ${heading('Accommodation', 'Rooms', 'Air-conditioned rooms with elegant interiors and serene estuary views.')}
    <div class="grid rooms-grid">${rooms.slice(0, 3).map(roomCard).join('')}</div>
    <p class="center"><a class="btn btn-line" href="/rooms">All rooms</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${heading('At the property', 'Facilities & amenities')}
    <div class="grid fac-grid">${facilities.slice(0, 8).map(facilityCard).join('')}</div>
    <p class="center"><a class="btn btn-gold dark-text" href="/facilities">All facilities</a></p>
  </div>
</section>

${c.dining_text ? `<section class="section sand"><div class="wrap split rev">
  <div class="split-text reveal"><span class="eyebrow">Dining</span><h2>Curated dining</h2>${paras(c.dining_text)}<a class="btn btn-gold dark-text" href="/contact">Ask the front desk</a></div>
  <div class="split-img single reveal"><img src="/img/front-view.jpg" alt="${esc(name)} waterfront" loading="lazy"></div>
</div></section>` : ''}

<section class="section">
  <div class="wrap">
    ${heading('Nearby', 'Experiences & activities', 'Eden Beach, backwater cruises, White Town and more are close to the property.')}
    <div class="grid exp-grid">${NEARBY.slice(0, 3).map((n) => `<article class="exp reveal"><img src="${n.img}" alt="${esc(n.name)}" loading="lazy"><div><h3>${esc(n.name)}</h3><p>${esc(n.text)}</p></div></article>`).join('')}</div>
    <p class="center"><a class="btn btn-gold dark-text" href="/experiences">All experiences</a></p>
  </div>
</section>

<section class="section dark">
  <div class="wrap">
    ${heading('Gallery', 'A glimpse of the BOATEL')}
    <div class="g-preview">${gallery.slice(0, 5).map((g) => `<a href="/gallery" class="reveal"><img src="${esc(g.image)}" alt="${esc(g.caption || 'Estuary Dreamz BOATEL photo')}" loading="lazy"></a>`).join('')}</div>
    <p class="center"><a class="btn btn-line" href="/gallery">View gallery</a></p>
  </div>
</section>

${reviews.length ? `<section class="section"><div class="wrap">${heading('Guest reviews', 'In our guests\u2019 words')}<div class="grid quote-grid">${reviews.map(testimonialCard).join('')}</div></div></section>` : ''}

<section class="section${reviews.length ? ' sand' : ''}">
  <div class="wrap split">
    <div class="split-text reveal">
      <span class="eyebrow">Location</span>
      <h2>Beside the backwaters</h2>
      <p class="lead">${esc(c.address)}</p>
      <p>Near Eden Beach, with easy access to Puducherry attractions.</p>
      <a class="btn btn-gold dark-text" href="https://www.google.com/maps/dir/?api=1&destination=${esc(c.latitude)},${esc(c.longitude)}" target="_blank" rel="noopener">Get directions</a>
      <a class="btn btn-line dark" href="/location">Location details</a>
    </div>
    <div class="map reveal">${mapEmbed(c)}</div>
  </div>
</section>

<section class="section cta-band">
  <div class="wrap center reveal">
    <h2>Plan your stay</h2>
    <p class="lead">Send a booking enquiry and the front desk will confirm availability and rates with you directly.</p>
    <a class="btn btn-gold" href="/booking">Booking Enquiry</a>
    <a class="btn btn-line" href="https://wa.me/${esc(c.whatsapp)}?text=${encodeURIComponent('Hello ' + name + ', I would like to make an enquiry.')}" target="_blank" rel="noopener">WhatsApp us</a>
  </div>
</section>`
    });
  }

  if (path === '/about') {
    return wrap({
      title: `About Us | ${name}`,
      desc: `About ${name}: a boat-style waterfront hotel in Puducherry beside the backwaters, near Eden Beach.`,
      jsonld: ld,
      body: `${pageHero('About the property', 'Puducherry\u2019s unique water-front BOATEL', '/img/front-view.jpg')}
<section class="section"><div class="wrap split">
  <div class="split-text reveal"><span class="eyebrow">Our story</span><h2>${esc(c.welcome_title)}</h2><p class="lead">${esc(c.welcome_text)}</p>${paras(c.about_text)}
    <a class="btn btn-gold dark-text" href="/booking">Booking Enquiry</a></div>
  <div class="split-img reveal"><img src="/img/building-2.jpg" alt="The BOATEL building" loading="lazy"><img class="alt" src="/img/building-1.jpg" alt="The BOATEL building view" loading="lazy"></div>
</div></section>
<section class="section dark"><div class="wrap">${heading('What defines the stay', 'Waterfront. Comfortable. Welcoming.')}
<div class="grid three">
  <div class="fac reveal"><span class="fac-ic">${icon('deck')}</span><h3>Waterfront luxury</h3><p>Elegant interiors and serene estuary views for a premium stay.</p></div>
  <div class="fac reveal"><span class="fac-ic">${icon('boat')}</span><h3>Waterfront location</h3><p>Near Eden Beach &amp; Radisson; easy access to Puducherry attractions.</p></div>
  <div class="fac reveal"><span class="fac-ic">${icon('spa')}</span><h3>Thoughtful amenities</h3><p>Air-conditioned rooms, curated dining, and relaxing wellness options.</p></div>
</div></div></section>`
    });
  }

  if (path === '/rooms') {
    return wrap({
      title: `Rooms & Accommodation | ${name}`,
      desc: `Air-conditioned rooms with serene estuary views at ${name}, Puducherry. Send an enquiry for availability and rates.`,
      jsonld: ld,
      body: `${pageHero('Rooms & accommodation', 'Elegant interiors and serene estuary views', '/img/bedroom.jpg')}
<section class="section"><div class="wrap">${heading('', 'Choose your room', 'Rates and availability are confirmed by the front desk after your enquiry.')}
<div class="grid rooms-grid">${rooms.map(roomCard).join('') || '<p class="center">Room details are being updated.</p>'}</div></div></section>`
    });
  }

  if (path === '/facilities') {
    return wrap({
      title: `Facilities & Amenities | ${name}`, desc: `Facilities at ${name}, Puducherry: air-conditioned rooms, pool, riverfront deck, boating, spa and more.`, jsonld: ld,
      body: `${pageHero('Facilities & amenities', '', '/img/pool.jpg')}
<section class="section"><div class="wrap">${heading('', 'Everything at the property')}<div class="grid fac-grid fac-5">${facilities.map(facilityCard).join('')}</div></div></section>
${c.dining_text ? `<section class="section sand"><div class="wrap split rev"><div class="split-text reveal"><span class="eyebrow">Dining</span><h2>Curated dining</h2>${paras(c.dining_text)}</div><div class="split-img single reveal"><img src="/img/building-2.jpg" alt="${esc(name)}" loading="lazy"></div></div></section>` : ''}`
    });
  }

  if (path === '/experiences') {
    return wrap({
      title: `Experiences & Activities | ${name}`, desc: `Top activities near ${name}: Eden Beach, Chunnambar backwater cruises, White Town and Arikamedu.`, jsonld: ld,
      body: `${pageHero('Experiences & activities', 'Top activities near the property', '/img/eden-beach.jpg')}
<section class="section"><div class="wrap">${heading('Nearby', 'Places to explore')}
<div class="grid exp-grid exp-4">${NEARBY.map((n) => `<article class="exp reveal"><img src="${n.img}" alt="${esc(n.name)}" loading="lazy"><div><h3>${esc(n.name)}</h3><p>${esc(n.text)}</p></div></article>`).join('')}</div>
<div class="note reveal"><h3>Observe traditional fishing</h3><p>Catch a glimpse of local fishermen working with nets and small boats \u2014 a window into coastal life. Be respectful and keep a considerate distance while observing.</p></div>
<p class="center"><a class="btn btn-gold dark-text" href="/booking">Booking Enquiry</a></p></div></section>`
    });
  }

  if (path === '/gallery') {
    const cats = [...new Set(gallery.map((g) => g.category))];
    return wrap({
      title: `Photo Gallery | ${name}`, desc: `Photos of ${name}, Puducherry: the property, rooms, pool and nearby attractions.`, jsonld: ld,
      body: `${pageHero('Photo gallery', '', '/img/chunnambar.jpg')}
<section class="section"><div class="wrap">
<div class="filters" role="group" aria-label="Filter photos"><button class="chip on" data-filter="all" type="button">All</button>${cats.map((x) => `<button class="chip" data-filter="${esc(x)}" type="button">${esc(x)}</button>`).join('')}</div>
<div class="masonry" id="gallery">${gallery.map(galleryItem).join('')}</div>
</div></section>
<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
  <button class="lb-close" type="button" aria-label="Close">&times;</button>
  <button class="lb-prev" type="button" aria-label="Previous photo">&#8249;</button>
  <figure><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure>
  <button class="lb-next" type="button" aria-label="Next photo">&#8250;</button>
</div>`
    });
  }

  if (path === '/location') {
    return wrap({
      title: `Location & Directions | ${name}`, desc: `Find ${name}: ${c.address}. Near Eden Beach, Puducherry.`, jsonld: ld,
      body: `${pageHero('Location & directions', 'Near Eden Beach, with easy access to Puducherry attractions', '/img/eden-beach.jpg')}
<section class="section"><div class="wrap">
<div class="map big reveal">${mapEmbed(c)}</div>
<div class="loc-row reveal"><div><h3>Address</h3><p>${esc(c.address)}</p></div>
<div class="loc-actions"><a class="btn btn-gold dark-text" href="https://www.google.com/maps/dir/?api=1&destination=${esc(c.latitude)},${esc(c.longitude)}" target="_blank" rel="noopener">Get directions</a>
<a class="btn btn-line dark" href="https://www.google.com/maps/search/?api=1&query=${esc(c.latitude)},${esc(c.longitude)}" target="_blank" rel="noopener">Open in Google Maps</a></div></div>
</div></section>`
    });
  }

  if (path === '/contact') {
    return wrap({
      title: `Contact Us | ${name}`, desc: `Contact ${name}, Puducherry by phone, WhatsApp or email, or send a message.`, jsonld: ld,
      body: `${pageHero('Contact us', 'We would love to hear from you', '/img/front-view.jpg')}
<section class="section"><div class="wrap split">
  <div class="reveal">${heading('', 'Get in touch', 'Reach out for bookings, enquiries or special requests.')}${contactBlock(c)}</div>
  <div class="reveal"><form class="form card" id="contactForm" novalidate data-property="${esc(name)}" data-wa="${esc(c.whatsapp)}" data-email="${esc(c.email)}">
    <h3>Send a message</h3>
    <label>Full name<input id="c_name" name="name" type="text" autocomplete="name" required maxlength="100"></label>
    <div class="f-row"><label>Email<input id="c_email" name="email" type="email" autocomplete="email" required maxlength="150"></label>
    <label>Phone (optional)<input id="c_phone" name="phone" type="tel" autocomplete="tel" maxlength="20"></label></div>
    <label>Message<textarea id="c_msg" name="message" rows="5" required maxlength="2000"></textarea></label>
    <p class="form-note">Your message opens in WhatsApp or your email app, ready to send.</p>
    <div class="form-actions">
      <button class="btn btn-gold" type="submit" value="wa">Send via WhatsApp</button>
      <button class="btn btn-line dark" type="submit" value="email">Send by Email</button>
    </div>
    <div class="form-status" id="contactStatus" role="status" aria-live="polite"></div>
  </form></div>
</div></section>`
    });
  }

  if (path === '/booking') {
    return wrap({
      title: `Booking Enquiry | ${name}`, desc: `Send a booking enquiry to ${name}, Puducherry. The front desk will confirm availability and rates.`, jsonld: ld,
      body: `${pageHero('Booking enquiry', 'Tell us your dates and we will get back to you', '/img/front-view.jpg')}
<section class="section"><div class="wrap split">
  <div class="card-box reveal">${bookingForm(c, rooms, '')}</div>
  <div class="reveal">${heading('', 'Prefer to talk?', 'Call or message the front desk directly.')}${contactBlock(c)}</div>
</div></section>`
    });
  }

  return null;
}

module.exports = { render, esc, telHref };
