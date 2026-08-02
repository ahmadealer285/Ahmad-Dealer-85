/* ==========================================================================
   Ahmad Dealer — script.js
   Handles: loader, header state, mobile nav, scroll reveal, counters,
   reviews marquee, FAQ accordion, owner modal, product modal, ripple.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileNav();
  initScrollReveal();
  initCounters();
  initReviews();
  initFaq();
  initOwnerModal();
  initProductModal();
  initRipple();
  initYear();
});

/* --------------------------------------------------------------------------
   Loader
   -------------------------------------------------------------------------- */

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loader-hidden'), 400);
  });

  // Fallback in case 'load' already fired or is delayed
  setTimeout(() => loader.classList.add('loader-hidden'), 2500);
}

/* --------------------------------------------------------------------------
   Sticky header state
   -------------------------------------------------------------------------- */

function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   Mobile nav toggle
   -------------------------------------------------------------------------- */

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.classList.toggle('active', isOpen);
  });

  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll reveal (IntersectionObserver)
   -------------------------------------------------------------------------- */

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Animated counters
   -------------------------------------------------------------------------- */

function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };

    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Reviews data + marquee build
   -------------------------------------------------------------------------- */

const REVIEWS = [
  { name: 'Bilal A.', role: 'Verified Buyer', stars: 5, text: 'Ordered a TikTok account and got it delivered within the hour. Smooth process from start to finish.' },
  { name: 'Sara K.', role: 'Verified Buyer', stars: 5, text: 'CapCut Pro works perfectly and Ahmad bhai replied to every question I had before buying.' },
  { name: 'Usman R.', role: 'Verified Buyer', stars: 4, text: 'Good service overall, took a little longer than expected but support kept me updated.' },
  { name: 'Ayesha M.', role: 'Verified Buyer', stars: 5, text: 'The ChatGPT prompt bundle is genuinely useful, way more organized than I expected for the price.' },
  { name: 'Hamza T.', role: 'Verified Buyer', stars: 5, text: 'Bought a Free Fire ID, pricing was fair and everything matched what was described.' },
  { name: 'Fatima Z.', role: 'Verified Buyer', stars: 4, text: 'InShot Pro setup was quick. Had one small issue and it was resolved same day on WhatsApp.' },
  { name: 'Ali Raza', role: 'Verified Buyer', stars: 5, text: 'Second time ordering from Ahmad Dealer. Consistent, honest, and fast every time.' },
  { name: 'Mahnoor S.', role: 'Verified Buyer', stars: 5, text: 'AI automation service saved me hours of manual work every week. Worth every rupee.' },
  { name: 'Zainab H.', role: 'Verified Buyer', stars: 4, text: 'Clear communication throughout. Would recommend to anyone looking for digital products locally.' },
  { name: 'Danish K.', role: 'Verified Buyer', stars: 5, text: 'Asked a lot of questions before buying the TikTok Live option and got honest, patient answers.' },
  { name: 'Iqra N.', role: 'Verified Buyer', stars: 5, text: 'Delivery was instant and the account details were exactly as promised. Very trustworthy seller.' },
  { name: 'Owais F.', role: 'Verified Buyer', stars: 4, text: 'Solid experience overall. Support responded quickly even late at night.' },
];

function starString(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function initReviews() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;

  const buildCard = (r) => {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-stars" aria-label="${r.stars} out of 5 stars">${starString(r.stars)}</div>
      <p class="review-text">${r.text}</p>
      <div class="review-author">
        <span class="review-avatar">${r.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
        <span>
          <span class="review-name" style="display:block;">${r.name}</span>
          <span class="review-role">${r.role}</span>
        </span>
      </div>
    `;
    return card;
  };

  // Duplicate the list once for a seamless infinite marquee
  const fullList = [...REVIEWS, ...REVIEWS];
  fullList.forEach((r) => track.appendChild(buildCard(r)));
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */

function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Owner modal
   -------------------------------------------------------------------------- */

function initOwnerModal() {
  const btn = document.getElementById('ownerBtn');
  const modal = document.getElementById('ownerModal');
  const closeBtn = document.getElementById('ownerModalClose');
  if (!btn || !modal || !closeBtn) return;

  const open = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    btn.focus();
  };

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* --------------------------------------------------------------------------
   Product details modal
   -------------------------------------------------------------------------- */

const PRODUCT_DETAILS = {
  p1: {
    badge: 'Popular',
    name: 'UK / USA TikTok Account',
    price: 'Rs. 1500',
    desc: 'Premium TikTok accounts intended for creators who want a UK or USA base. Features and eligibility depend on TikTok\u2019s own policies and each account\u2019s history, so details are shared and confirmed with you before purchase.',
    wa: 'https://wa.me/923290050285?text=Hi%2C%20I%27m%20interested%20in%20the%20UK%2FUSA%20TikTok%20Account%20(Rs.1500)',
  },
  p2: {
    badge: 'Guidance',
    name: 'TikTok Live Option',
    price: 'Rs. 500',
    desc: 'Assistance and guidance related to TikTok Live eligibility and setup. This is a support service, not a guaranteed activation \u2014 final access always depends on TikTok\u2019s own review.',
    wa: 'https://wa.me/923290050285?text=Hi%2C%20I%27m%20interested%20in%20the%20TikTok%20Live%20Option%20(Rs.500)',
  },
  p3: {
    badge: 'Service',
    name: 'AI Automation',
    price: 'Rs. 500',
    desc: 'A professional AI automation setup built around your specific repetitive tasks, so you can spend less time on manual work.',
    wa: 'https://wa.me/923290050285?text=Hi%2C%20I%27m%20interested%20in%20AI%20Automation%20(Rs.500)',
  },
  p4: {
    badge: 'Software',
    name: 'CapCut Pro',
    price: 'Rs. 500',
    desc: 'Premium editing solution for creators who want the full CapCut toolset for smoother, faster video production.',
    wa: 'https://wa.me/923290050285?text=Hi%2C%20I%27m%20interested%20in%20CapCut%20Pro%20(Rs.500)',
  },
  p5: {
    badge: 'Software',
    name: 'InShot Pro',
    price: 'Rs. 500',
    desc: 'Premium editing solution built for quick, mobile-first content \u2014 clean exports, no watermarks, more tools.',
    wa: 'https://wa.me/923290050285?text=Hi%2C%20I%27m%20interested%20in%20InShot%20Pro%20(Rs.500)',
  },
  p6: {
    badge: 'Bundle',
    name: '100+ ChatGPT Image Prompt Bundle',
    price: 'Rs. 200',
    desc: 'A professional, ready-to-use collection of over 100 image generation prompts, organized so you can start creating right away.',
    wa: 'https://wa.me/923290050285?text=Hi%2C%20I%27m%20interested%20in%20the%20100%2B%20ChatGPT%20Image%20Prompt%20Bundle%20(Rs.200)',
  },
  p7: {
    badge: 'Gaming',
    name: 'Free Fire ID',
    price: 'Contact for price',
    desc: 'Pricing depends on the specific account \u2014 rank, skins and level all affect value. Message us on WhatsApp for current availability and pricing.',
    wa: 'https://wa.me/923290050285?text=Hi%2C%20I%27m%20interested%20in%20a%20Free%20Fire%20ID',
  },
};

function initProductModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('productModalClose');
  const badgeEl = document.getElementById('productModalBadge');
  const titleEl = document.getElementById('productModalTitle');
  const priceEl = document.getElementById('productModalPrice');
  const descEl = document.getElementById('productModalDesc');
  const ctaEl = document.getElementById('productModalCta');
  if (!modal) return;

  let lastTrigger = null;

  const open = (key, trigger) => {
    const data = PRODUCT_DETAILS[key];
    if (!data) return;

    badgeEl.textContent = data.badge;
    titleEl.textContent = data.name;
    priceEl.textContent = data.price;
    descEl.textContent = data.desc;
    ctaEl.href = data.wa;

    lastTrigger = trigger;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  };

  document.querySelectorAll('.details-btn').forEach((btn) => {
    btn.addEventListener('click', () => open(btn.dataset.target, btn));
  });

  closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* --------------------------------------------------------------------------
   Button ripple effect
   -------------------------------------------------------------------------- */

function initRipple() {
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      this.style.setProperty('--x', `${e.clientX - rect.left}px`);
      this.style.setProperty('--y', `${e.clientY - rect.top}px`);
      this.classList.remove('rippling');
      // Force reflow so the animation can restart on rapid clicks
      void this.offsetWidth;
      this.classList.add('rippling');
    });
  });
}

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
