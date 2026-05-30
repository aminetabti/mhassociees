/* ─── Language ───────────────────────────────────────────────────────────────── */
let currentLang = localStorage.getItem('lang') || 'fr';

const langToggle = document.getElementById('lang-toggle');
const langFrLabel = langToggle && langToggle.querySelector('.lang-fr');
const langEnLabel = langToggle && langToggle.querySelector('.lang-en');

const SELECT_OPTIONS = {
  fr: ['Sélectionner…', 'Droit criminel', 'Immigration', 'Droit carcéral', 'Droit de la jeunesse', 'Autre'],
  en: ['Select…', 'Criminal Law', 'Immigration', 'Carceral Law', 'Youth Law', 'Other'],
};

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('.fr').forEach(el => el.classList.toggle('hidden', lang !== 'fr'));
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('hidden', lang !== 'en'));

  if (langFrLabel) langFrLabel.classList.toggle('active', lang === 'fr');
  if (langEnLabel) langEnLabel.classList.toggle('active', lang === 'en');

  const select = document.getElementById('subject');
  if (select) {
    const opts = SELECT_OPTIONS[lang];
    [...select.options].forEach((opt, i) => { if (opts[i]) opt.text = opts[i]; });
    select.options[0].disabled = true;
    select.options[0].selected = true;
  }
}

if (langToggle) {
  langToggle.addEventListener('click', () => setLang(currentLang === 'fr' ? 'en' : 'fr'));
}

/* ─── Nav scroll / solid ─────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');

function updateNav() {
  if (!nav) return;
  if (nav.classList.contains('nav-solid')) return;
  nav.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── Mobile hamburger ──────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ─── Dropdown (mobile tap) ─────────────────────────────────────────────────── */
document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      btn.closest('.dropdown').classList.toggle('open');
    }
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
});

/* ─── Scroll fade-in ────────────────────────────────────────────────────────── */
const fadeTargets = document.querySelectorAll(
  '.service-card, .about-block, .contact-item, .section-header, .about-text, .contact-info, .contact-form, .check-item, .process-item, .value-card, .sidebar-card, .remote-banner, .cabinet-grid'
);
fadeTargets.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeTargets.forEach(el => observer.observe(el));

/* ─── Contact form ──────────────────────────────────────────────────────────── */
const form = document.getElementById('contact-form');
if (form) {
  const t = (fr, en) => (currentLang === 'fr' ? fr : en);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: real users never fill this hidden field.
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    // Every field must be filled before the request can be sent.
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;
    const reset = (delay) => setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.cssText = '';
      setLang(currentLang);
    }, delay);

    btn.disabled = true;
    btn.style.cssText = '';
    btn.textContent = t('Envoi…', 'Sending…');

    try {
      const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === true || data.success === 'true')) {
        btn.textContent = t('Envoyé ✓', 'Sent ✓');
        btn.style.cssText = 'background:#16a34a;border-color:#16a34a;cursor:default';
        form.reset();
        reset(3500);
      } else {
        throw new Error('submit failed');
      }
    } catch (err) {
      btn.textContent = t('Erreur — réessayer', 'Error — try again');
      btn.style.cssText = 'background:#dc2626;border-color:#dc2626;cursor:pointer';
      reset(3500);
    }
  });
}

/* ─── Init ──────────────────────────────────────────────────────────────────── */
setLang(currentLang);
