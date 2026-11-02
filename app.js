// ---- AOS Init ----
AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic', offset: 60 });

// ---- Navbar scroll behaviour ----
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 60);
  backTop.classList.toggle('visible', scrollY > 400);
});

// ---- Hamburger / Mobile menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// ---- Active Nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4, rootMargin: '-60px 0px -40% 0px' });
sections.forEach(s => observer.observe(s));

// ---- Counter Animation ----
function animateCounter(el, target, suffix, duration) {
  duration = duration || 1800;
  suffix = suffix || '';
  var start = 0;
  var step = target / (duration / 16);
  function update() {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start < target) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

var statsConfig = {
  'stat-patients': { val: 10000, suffix: '+' },
  'stat-exp': { val: 15, suffix: '+' },
  'stat-docs': { val: 8, suffix: '+' },
  'stat-rating': { val: 98, suffix: '%' }
};

var statsAnimated = false;
var statsSection = document.getElementById('stats');
var statsObs = new IntersectionObserver(function(entries) {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    Object.keys(statsConfig).forEach(function(id) {
      var cfg = statsConfig[id];
      var el = document.getElementById(id);
      if (el) animateCounter(el, cfg.val, cfg.suffix);
    });
  }
}, { threshold: 0.3 });
statsObs.observe(statsSection);

// ---- Testimonials Slider ----
var track = document.getElementById('testTrack');
var dots = document.querySelectorAll('.slider-dot');
var currentSlide = 0;
var totalTestimonials = 5;

function visibleCards() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}
function totalSlides() {
  return Math.ceil(totalTestimonials / visibleCards());
}
function updateDotsCount() {
  var tc = totalSlides();
  dots.forEach(function(d, i) {
    d.style.display = i < tc ? '' : 'none';
  });
}
function goToSlide(idx) {
  var vc = visibleCards();
  var cardW = track.parentElement.offsetWidth / vc;
  var gap = 24;
  currentSlide = Math.max(0, Math.min(idx, totalSlides() - 1));
  track.style.transform = 'translateX(-' + (currentSlide * (cardW + gap)) + 'px)';
  dots.forEach(function(d, i) {
    d.classList.toggle('active', i === currentSlide);
  });
}

document.getElementById('prevBtn').addEventListener('click', function() { goToSlide(currentSlide - 1); });
document.getElementById('nextBtn').addEventListener('click', function() { goToSlide(currentSlide + 1); });
dots.forEach(function(d) {
  d.addEventListener('click', function() { goToSlide(+d.dataset.idx); });
  d.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') goToSlide(+d.dataset.idx); });
});

window.addEventListener('resize', function() { updateDotsCount(); goToSlide(0); });
updateDotsCount();

var sliderTimer = setInterval(function() { goToSlide((currentSlide + 1) % totalSlides()); }, 5000);
track.parentElement.addEventListener('mouseenter', function() { clearInterval(sliderTimer); });
track.parentElement.addEventListener('mouseleave', function() {
  sliderTimer = setInterval(function() { goToSlide((currentSlide + 1) % totalSlides()); }, 5000);
});

// ---- Gallery Lightbox ----
function openLightbox(src, caption) {
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeLightbox();
});
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLightbox(); });
document.querySelectorAll('.gallery-item').forEach(function(item) {
  item.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') item.click();
  });
});

// ---- Appointment Form Validation ----
var form = document.getElementById('appointmentForm');
function showError(inputId, errId, show) {
  document.getElementById(inputId).classList.toggle('error', show);
  document.getElementById(errId).classList.toggle('show', show);
}
form.addEventListener('submit', function(e) {
  e.preventDefault();
  var valid = true;
  var name = document.getElementById('apptName').value.trim();
  var phone = document.getElementById('apptPhone').value.trim();
  var date = document.getElementById('apptDate').value;

  if (!name) { showError('apptName', 'err-name', true); valid = false; }
  else showError('apptName', 'err-name', false);

  if (!/^\d{10}$/.test(phone.replace(/\s+/g, ''))) { showError('apptPhone', 'err-phone', true); valid = false; }
  else showError('apptPhone', 'err-phone', false);

  if (!date) { showError('apptDate', 'err-date', true); valid = false; }
  else showError('apptDate', 'err-date', false);

  if (valid) {
    var btn = document.getElementById('apptSubmitBtn');
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    setTimeout(function() {
      form.reset();
      btn.textContent = 'Confirm Appointment Request';
      btn.disabled = false;
      document.getElementById('formSuccess').classList.add('show');
      setTimeout(function() { document.getElementById('formSuccess').classList.remove('show'); }, 6000);
    }, 1200);
  }
});
document.getElementById('apptName').addEventListener('input', function() { showError('apptName', 'err-name', false); });
document.getElementById('apptPhone').addEventListener('input', function() { showError('apptPhone', 'err-phone', false); });
document.getElementById('apptDate').addEventListener('change', function() { showError('apptDate', 'err-date', false); });

// ---- Set min date ----
var dateInput = document.getElementById('apptDate');
if (dateInput) { dateInput.min = new Date().toISOString().split('T')[0]; }
