'use strict';
/*
  ALL SITE CONTENT LIVES HERE as plain data. There is no database and no backend.
  To change anything: edit this file, run `npm run build`, then upload the `out/` folder.

  Only facts taken from the businesses' existing websites are published. Items marked CHECK need the
  owner's confirmation. Never add prices, capacities or reviews that are not real and verified.
*/

const content = {
  site_name: 'Estuary Dreamz BOATEL',
  site_url: 'https://star13.in', // used for canonical links, sitemap and social previews
  hero_eyebrow: 'Puducherry · Waterfront BOATEL',
  hero_title: 'Wake to the water’s edge.',
  hero_text: 'Puducherry’s unique water-front BOATEL, with serene river views, modern comforts and warm hospitality.',
  welcome_title: 'Welcome to Estuary Dreamz BOATEL',
  welcome_text: 'Experience Puducherry’s unique water-front BOATEL with serene river views, modern comforts and warm hospitality.',
  about_text: 'Estuary Dreamz BOATEL is a boat-style waterfront hotel in Puducherry, beside the backwaters and near Eden Beach, with easy access to the attractions of Puducherry.\n\nThe property offers air-conditioned rooms, curated dining and relaxing wellness options, with elegant interiors and serene estuary views.',
  dining_text: 'Curated dining is part of the stay at Estuary Dreamz BOATEL. Please contact the front desk for current menus and timings.',
  address: 'No 70/28, Anthony Udaiyar St, Manavely, Chinna Veerampattinam, Puducherry 605007',
  phone_1: '+91 90470 47567',
  phone_2: '+91 90478 56736',
  phone_3: '+91 413 297 5667',
  whatsapp: '919047047567', // digits only, with country code
  email: 'ed.boatel@star13.in',
  latitude: '11.88125',
  longitude: '79.81566',
  footer_note: 'Rates, availability and arrangements are confirmed directly by the front desk.',

  // ---- Destiny DreamZ Villa (second business). Text and contact details from destiny-dream-z-villa.vercel.app ----
  villa_tagline: 'Puducherry’s Premium Villa Stay.',
  villa_intro: 'Experience Puducherry’s premium villa stay with serene ambiance, modern comforts, and warm hospitality at Destiny DreamZ Villa.',
  villa_about: 'Destiny DreamZ Villa is Puducherry’s premier villa retreat, offering a unique blend of luxury and tranquility. Ideally located near city highlights and Promenade Beach, we offer an experience designed for comfort and ease.\n\nFamily-founded and locally inspired, our villa is run by hospitality professionals who are passionate about providing exceptional service and making every guest’s stay truly special. We invite you to discover a peaceful escape where comfort meets the charm of Puducherry’s natural beauty. Our thoughtfully designed spaces reflect an elegant, contemporary theme, blending modern amenities with rustic elegance to create an atmosphere of relaxed sophistication.\n\nEnjoy scenic surroundings, indulge in curated dining experiences, and unwind with relaxing amenities throughout your stay.\n\nWhether you are seeking a romantic getaway, a family vacation, or a unique event venue, Destiny DreamZ Villa promises an unforgettable experience. We also offer special packages for honeymoons, corporate retreats, and bespoke celebrations, ensuring every occasion is truly memorable.',
  villa_address: '131, Kandappa Mudaliar St, MG Road Area, Puducherry - 605001',
  villa_phone_1: '+91 90470 47567',
  villa_phone_2: '+91 90478 56736',
  villa_phone_3: '+91 413 297 5667',
  villa_whatsapp: '919047047567',
  villa_email: 'info@destinydreamzvilla.com', // CHECK: the Villa site shows this in its footer but the BOATEL email in its contact section
  villa_latitude: '11.930607',
  villa_longitude: '79.822696'
};

// Room types, capacity and rates are NOT published on the existing sites, so these are editable placeholders.
const rooms = [
  { id: 1, name: 'Air-conditioned Room', description: 'Elegant interiors with serene estuary views. Room details are being updated by the property.', features: 'Air-conditioned', capacity: '', price: '', image: '/img/bedroom.jpg' },
  { id: 2, name: 'Waterfront View Room', description: 'A comfortable stay beside the backwaters of Puducherry. Room details are being updated by the property.', features: 'Air-conditioned', capacity: '', price: '', image: '/img/bedroom-2.jpg' }
];

// icon names: snow, pool, deck, boat, spa, dining, wifi, car, family, meeting, star.  CHECK each against reality.
// image: optional photo shown on the card (put the file in public/img/ and use '/img/yourfile.jpg'); imageAlt describes it.
// A facility without an image shows a matching illustrated panel. Only use photos that really show that facility.
const facilities = [
  { name: 'Air-conditioned rooms', description: 'Comfortable air-conditioned accommodation.', icon: 'snow', image: '/img/bedroom.jpg', imageAlt: 'Air-conditioned guest room at Estuary Dreamz BOATEL' },
  { name: 'Swimming pool', description: 'A pool on the property.', icon: 'pool', image: '/img/pool.jpg', imageAlt: 'Swimming pool at Estuary Dreamz BOATEL' },
  { name: 'Riverfront deck', description: 'Serene river views from the deck.', icon: 'deck', image: '/img/building-1.jpg', imageAlt: 'Estuary Dreamz BOATEL beside the river' },
  { name: 'Boating', description: 'Boating experiences nearby, including backwater cruises at Chunnambar.', icon: 'boat', image: '/img/chunnambar.jpg', imageAlt: 'Boats at Chunnambar Boat House' },
  { name: 'Spa & wellness', description: 'Relaxing wellness options.', icon: 'spa', image: '/img/spa.png', imageAlt: 'Couple enjoying a relaxing spa massage' },
  { name: 'Curated dining', description: 'Dining at the property.', icon: 'dining', image: '/img/dining.png', imageAlt: 'A table laid with breakfast dishes and drinks' },
  { name: 'Free WiFi', description: 'Wireless internet for guests.', icon: 'wifi', image: '/img/wifi.png', imageAlt: 'Person working on a laptop at a desk' },
  { name: 'Parking', description: 'On-site parking.', icon: 'car', image: '/img/parking.png', imageAlt: 'Cars parked outside a hotel entrance at night' },
  { name: 'Family rooms', description: 'Rooms suited to families.', icon: 'family', image: '/img/bedroom-2.jpg', imageAlt: 'Guest room at Estuary Dreamz BOATEL' },
  { name: 'Conference room', description: 'Space for meetings and events.', icon: 'meeting' }
];

const gallery = [
  { image: '/img/front-view.jpg', caption: 'Estuary Dreamz BOATEL, front view', category: 'Property' },
  { image: '/img/building-1.jpg', caption: 'The BOATEL building', category: 'Property' },
  { image: '/img/building-2.jpg', caption: 'The BOATEL building from another angle', category: 'Property' },
  { image: '/img/pool.jpg', caption: 'Swimming pool', category: 'Pool' },
  { image: '/img/bedroom.jpg', caption: 'Guest room', category: 'Rooms' },
  { image: '/img/bedroom-2.jpg', caption: 'Guest room with building view', category: 'Rooms' },
  { image: '/img/eden-beach.jpg', caption: 'Eden Beach, nearby', category: 'Nearby' },
  { image: '/img/chunnambar.jpg', caption: 'Chunnambar Boat House, nearby', category: 'Nearby' },
  { image: '/img/white-town.jpg', caption: 'White Town promenade, Puducherry', category: 'Nearby' },
  { image: '/img/arikamedu.jpg', caption: 'Arikamedu archaeological site, nearby', category: 'Nearby' }
];

// Guest reviews: leave empty until you have real, verified reviews. Example entry:
// { name: 'Guest name', text: 'Their review.', rating: 5, source: 'Google' }
const testimonials = [];

module.exports = { content, rooms, facilities, gallery, testimonials };
