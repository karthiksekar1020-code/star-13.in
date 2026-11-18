(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ----- navigation -----
  var nav = $('#nav'), burger = $('#burger');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); setSub(false); } });
  window.matchMedia('(min-width:1181px)').addEventListener('change', function () { setMenu(false); });

  // "Our Businesses" dropdown (hover/focus on desktop via CSS; click, tap and keyboard here)
  var subItem = $('.has-sub'), subBtn = $('#biz-btn');
  function setSub(open) {
    if (!subItem) return;
    subItem.classList.toggle('open', open);
    subBtn.setAttribute('aria-expanded', String(open));
  }
  if (subItem) {
    subBtn.addEventListener('click', function () { setSub(!subItem.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!subItem.contains(e.target)) setSub(false); });
    // keep sub-menu links out of the generic "close the mobile menu" handler's way: they navigate away anyway
  }

  // ----- scroll reveal -----
  var items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // ----- gallery: filter + lightbox -----
  var gal = $('#gallery');
  if (gal) {
    var figs = $$('.g-item', gal);
    $$('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        $$('.chip').forEach(function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
        var f = chip.getAttribute('data-filter');
        figs.forEach(function (fig) { fig.hidden = !(f === 'all' || fig.getAttribute('data-cat') === f); });
      });
    });
    var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), cur = 0, opener = null;
    var visible = function () { return figs.filter(function (f) { return !f.hidden; }); };
    function show(i) {
      var v = visible(); if (!v.length) return;
      cur = (i + v.length) % v.length;
      var img = $('img', v[cur]);
      lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
    }
    function open(fig) {
      opener = document.activeElement;
      lb.hidden = false; document.body.style.overflow = 'hidden';
      show(visible().indexOf(fig));
      $('.lb-close', lb).focus();
    }
    function close() { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }
    figs.forEach(function (fig) { $('.g-btn', fig).addEventListener('click', function () { open(fig); }); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx == null) return; var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); sx = null;
    });
  }

  // ----- forms (static site: no server) -----
  // The form is checked in the browser, then the details open in WhatsApp or the visitor's own
  // email app, ready to send. Nothing is stored or transmitted by this website.
  function setErr(input, msg) {
    var label = input.closest('label'); if (!label) return;
    var old = $('.f-err', label); if (old) old.remove();
    input.removeAttribute('aria-invalid');
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      var s = document.createElement('span'); s.className = 'f-err'; s.textContent = msg; label.appendChild(s);
    }
  }
  function wire(form, statusEl, validate, build) {
    var kind = 'wa';
    $$('button[type=submit]', form).forEach(function (b) { b.addEventListener('click', function () { kind = b.value || 'wa'; }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (e.submitter && e.submitter.value) kind = e.submitter.value;
      statusEl.className = 'form-status'; statusEl.textContent = '';
      var errs = validate(form), first = null;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name) return;
        var m = errs[el.name]; setErr(el, m || '');
        if (m && !first) first = el;
      });
      if (first) { first.focus(); statusEl.className = 'form-status err'; statusEl.textContent = 'Please correct the highlighted fields.'; return; }
      var msg = build(form);
      var url = kind === 'email'
        ? 'mailto:' + form.getAttribute('data-email') + '?subject=' + encodeURIComponent(msg.subject) + '&body=' + encodeURIComponent(msg.text)
        : 'https://wa.me/' + form.getAttribute('data-wa') + '?text=' + encodeURIComponent(msg.text);
      var link = document.createElement('a');
      link.href = url; link.textContent = kind === 'email' ? 'open your email app' : 'open WhatsApp';
      if (kind !== 'email') { link.target = '_blank'; link.rel = 'noopener'; }
      statusEl.className = 'form-status ok';
      statusEl.appendChild(document.createTextNode((kind === 'email' ? 'Opening your email app' : 'Opening WhatsApp') + ' with your details. Press send there to complete your enquiry. If nothing opened, '));
      statusEl.appendChild(link); statusEl.appendChild(document.createTextNode('.'));
      if (kind === 'email') window.location.href = url; else window.open(url, '_blank', 'noopener');
    });
  }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, PHONE = /^\+?[\d][\d\s\-()]{6,19}$/;
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function setDefaults(f) {
    var t = new Date(), t2 = new Date(Date.now() + 864e5);
    f.check_in.min = iso(t); f.check_out.min = iso(t2);
  }
  function val(f, n) { return f.elements[n] ? f.elements[n].value.trim() : ''; }

  var bf = $('#bookingForm');
  if (bf) {
    setDefaults(bf);
    var q = new URLSearchParams(location.search).get('room');
    if (q && bf.room) Array.prototype.forEach.call(bf.room.options, function (o) { if (o.text === q) o.selected = true; });
    bf.check_in.addEventListener('change', function () {
      if (bf.check_in.value) {
        var d = new Date(bf.check_in.value + 'T00:00:00'); d.setDate(d.getDate() + 1);
        bf.check_out.min = iso(d);
        if (bf.check_out.value && bf.check_out.value <= bf.check_in.value) bf.check_out.value = iso(d);
      }
    });
    wire(bf, $('#bookingStatus'), function (f) {
      var e = {};
      if (val(f, 'name').length < 2) e.name = 'Please enter your name.';
      if (!PHONE.test(val(f, 'phone'))) e.phone = 'Please enter a valid phone number.';
      if (!EMAIL.test(val(f, 'email'))) e.email = 'Please enter a valid email address.';
      if (!val(f, 'check_in') || val(f, 'check_in') < iso(new Date())) e.check_in = 'Please choose a valid check-in date.';
      if (!val(f, 'check_out') || val(f, 'check_out') <= val(f, 'check_in')) e.check_out = 'Check-out must be after check-in.';
      var g = parseInt(val(f, 'guests'), 10); if (!(g >= 1 && g <= 20)) e.guests = 'Guests must be between 1 and 20.';
      return e;
    }, function (f) {
      var p = f.getAttribute('data-property');
      var lines = ['Booking enquiry for ' + p, '', 'Name: ' + val(f, 'name'), 'Phone: ' + val(f, 'phone'), 'Email: ' + val(f, 'email'),
        'Check-in: ' + val(f, 'check_in'), 'Check-out: ' + val(f, 'check_out'), 'Guests: ' + val(f, 'guests')];
      if (val(f, 'room')) lines.push('Room preference: ' + val(f, 'room'));
      if (val(f, 'message')) lines.push('Special requests: ' + val(f, 'message'));
      return { subject: 'Booking enquiry - ' + p, text: lines.join('\n') };
    });
  }
  var cf = $('#contactForm');
  if (cf) {
    wire(cf, $('#contactStatus'), function (f) {
      var e = {};
      if (val(f, 'name').length < 2) e.name = 'Please enter your name.';
      if (!EMAIL.test(val(f, 'email'))) e.email = 'Please enter a valid email address.';
      if (val(f, 'phone') && !PHONE.test(val(f, 'phone'))) e.phone = 'Please enter a valid phone number.';
      if (val(f, 'message').length < 5) e.message = 'Please enter your message.';
      return e;
    }, function (f) {
      var p = f.getAttribute('data-property');
      var lines = ['Message for ' + p, '', 'Name: ' + val(f, 'name'), 'Email: ' + val(f, 'email')];
      if (val(f, 'phone')) lines.push('Phone: ' + val(f, 'phone'));
      lines.push('', val(f, 'message'));
      return { subject: 'Enquiry - ' + p, text: lines.join('\n') };
    });
  }
})();
