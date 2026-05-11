/* ============================================================
   GEARS EXTERIORS AND INTERLOCK — Main JavaScript
   ============================================================ */

'use strict';

/* --- Sticky Nav --- */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function handleScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
})();

/* --- Hamburger / Mobile Nav --- */
(function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = '';
    });
  });
})();

/* --- Active Nav Link --- */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* --- Hero Ken Burns + Load class --- */
(function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // Add loaded class after a small delay so CSS transition plays
  window.addEventListener('load', function () {
    setTimeout(function () {
      hero.classList.add('loaded');
    }, 100);
  });
})();

/* --- Scroll Reveal --- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    elements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }
})();

/* --- Gallery Lightbox --- */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('#lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item, .gallery-page-item');

  galleryItems.forEach(function (item) {
    function openItem() {
      const img = item.querySelector('img');
      if (!img || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Gallery image';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    item.addEventListener('click', openItem);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openItem();
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* --- Gallery Filter (gallery.html only) --- */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-page-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================
   NOTE FOR DEVELOPERS:
   This form currently performs front-end validation only.
   To add backend/email functionality, integrate one of these:
   - Formspree (https://formspree.io) — add action attribute to form
   - Netlify Forms — add netlify attribute to form element
   - EmailJS (https://www.emailjs.com) — send email from JavaScript
   - A custom PHP/Node.js backend endpoint via fetch()
   Replace the handleSuccess() call below with your actual submission logic.
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  /* --- Validation rules --- */
  const rules = {
    name:        { required: true, minLength: 2,  label: 'Full name' },
    phone:       { required: true, pattern: /^[\d\s()\-+]{7,}$/, label: 'Phone number' },
    email:       { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email' },
    projectType: { required: true, label: 'Project type' },
    message:     { required: true, minLength: 10, label: 'Message' }
  };

  function getField(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function getError(field) {
    return field.parentNode.querySelector('.form-error-msg');
  }

  function showError(field, message) {
    field.classList.add('error');
    const err = getError(field);
    if (err) {
      err.textContent = message;
      err.classList.add('visible');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const err = getError(field);
    if (err) {
      err.textContent = '';
      err.classList.remove('visible');
    }
  }

  function validateField(name, value) {
    const rule = rules[name];
    if (!rule) return true;

    value = (value || '').trim();

    if (rule.required && !value) {
      return rule.label + ' is required.';
    }
    if (rule.minLength && value.length < rule.minLength) {
      return rule.label + ' must be at least ' + rule.minLength + ' characters.';
    }
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return 'Please enter a valid ' + rule.label.toLowerCase() + '.';
    }
    return true;
  }

  /* Live validation on blur */
  Object.keys(rules).forEach(function (name) {
    const field = getField(name);
    if (!field) return;
    field.addEventListener('blur', function () {
      const result = validateField(name, field.value);
      if (result === true) {
        clearError(field);
      } else {
        showError(field, result);
      }
    });
    field.addEventListener('input', function () {
      clearError(field);
    });
  });

  /* Submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    Object.keys(rules).forEach(function (name) {
      const field = getField(name);
      if (!field) return;
      const result = validateField(name, field.value);
      if (result === true) {
        clearError(field);
      } else {
        showError(field, result);
        isValid = false;
      }
    });

    if (!isValid) return;

    /* --- SUCCESS HANDLER ---
       Replace this block with your actual backend submission:

       fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(Object.fromEntries(new FormData(form)))
       }).then(...);
    */
    handleSuccess();
  });

  function handleSuccess() {
    form.reset();
    if (successMsg) {
      successMsg.classList.add('visible');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(function () {
        successMsg.classList.remove('visible');
      }, 6000);
    }
  }
})();
