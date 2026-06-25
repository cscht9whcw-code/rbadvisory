/* ============================================================
   Red Beacon Asset Management — script.js
   Vanilla JS only. No jQuery, no frameworks.
   ============================================================ */

'use strict';

/* ============================================================
   NAVBAR — scroll shadow + hamburger toggle
   ============================================================ */
(function initNavbar() {
  const header    = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger-btn');
  const nav       = document.getElementById('primary-nav');

  // Add shadow when page is scrolled
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav when any nav link is clicked
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}());

/* ============================================================
   SMOOTH SCROLL — anchor links
   (CSS scroll-behavior handles most cases; this ensures
   offset accuracy if the header height ever shifts.)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}());

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initReveal() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
}());

/* ============================================================
   TESTIMONIAL CAROUSEL
   ============================================================ */
(function initCarousel() {
  var testimonials = [
    {
      initials: 'MH',
      quote: 'Red Beacon helped us move from feeling anxious about retirement to genuinely excited. The clarity they brought to our financial picture was invaluable — we only wish we had found them sooner.',
      name: 'Margaret & Lewis Hartwell',
      role: 'Retired Surgeon & Educator · Client since 2015'
    },
    {
      initials: 'JP',
      quote: 'I came in thinking I just needed a portfolio review. What I received was a complete rethink of my estate plan that will genuinely benefit my children for generations. I can\'t recommend them highly enough.',
      name: 'Jonathan Patel',
      role: 'Managing Partner, Technology Sector'
    },
    {
      initials: 'SR',
      quote: 'In a decade working with Red Beacon I\'ve never once felt like a number. They know my family\'s story, and every recommendation reflects that personal understanding. That integrity matters deeply to me.',
      name: 'Sofia Reinholt',
      role: 'Principal Architect · Client since 2014'
    }
  ];

  var currentIndex = 0;
  var timer        = null;
  var INTERVAL     = 5000;

  var track        = document.getElementById('carousel-track');
  var dotsWrap     = document.getElementById('carousel-dots');
  var prevBtn      = document.getElementById('prev-btn');
  var nextBtn      = document.getElementById('next-btn');
  var carousel     = document.getElementById('carousel');

  function renderSlide(index) {
    var t = testimonials[index];
    track.innerHTML =
      '<div class="testimonial-card" role="group" aria-roledescription="slide" aria-label="Testimonial ' + (index + 1) + ' of ' + testimonials.length + '">' +
        '<div class="testimonial-avatar" aria-hidden="true">' + t.initials + '</div>' +
        '<p class="testimonial-quote">' + escapeHtml(t.quote) + '</p>' +
        '<div class="testimonial-name">' + escapeHtml(t.name) + '</div>' +
        '<div class="testimonial-role">' + escapeHtml(t.role) + '</div>' +
      '</div>';

    dotsWrap.querySelectorAll('.dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', String(i === index));
    });
  }

  function goTo(index) {
    currentIndex = ((index % testimonials.length) + testimonials.length) % testimonials.length;
    renderSlide(currentIndex);
  }

  function startTimer() {
    timer = setInterval(function () { goTo(currentIndex + 1); }, INTERVAL);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  // Build dot buttons
  testimonials.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', function () { goTo(i); stopTimer(); startTimer(); });
    dotsWrap.appendChild(dot);
  });

  prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); stopTimer(); startTimer(); });
  nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); stopTimer(); startTimer(); });

  // Pause auto-advance while user hovers
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);

  // Keyboard navigation (left/right arrow when carousel is focused)
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { goTo(currentIndex - 1); stopTimer(); startTimer(); }
    if (e.key === 'ArrowRight') { goTo(currentIndex + 1); stopTimer(); startTimer(); }
  });

  // Init
  renderSlide(0);
  startTimer();

  function escapeHtml(str) {
    return str
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#039;');
  }
}());

/* ============================================================
   FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   ENQUIRY FORM — validation + FormSubmit AJAX
   ============================================================
   FormSubmit setup notes:
   1. Replace FORM_EMAIL below with your actual email address.
   2. The very first submission to a new address triggers a
      confirmation email from FormSubmit — click that link to
      activate. All subsequent submissions deliver normally.
   3. The form must be served over HTTP/HTTPS (not file://).
      Use "npx serve ." or VS Code Live Server for local testing.
   ============================================================ */

// REPLACE_WITH_YOUR_EMAIL — swap this with your real email address.
var FORM_EMAIL = 'REPLACE_WITH_YOUR_EMAIL';

(function initForm() {
  var form       = document.getElementById('enquiry-form');
  var submitBtn  = document.getElementById('submit-btn');
  var formError  = document.getElementById('form-error');
  var formSuccess = document.getElementById('form-success');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---- helpers ---- */
  function setError(inputId, errorId, msg) {
    var input = document.getElementById(inputId);
    var span  = document.getElementById(errorId);
    if (msg) {
      input.classList.add('invalid');
      span.textContent = msg;
      return true;
    }
    input.classList.remove('invalid');
    span.textContent = '';
    return false;
  }

  function clearAllErrors() {
    setError('full-name', 'name-error',     '');
    setError('email',     'email-error',    '');
    setError('interest',  'interest-error', '');
    setError('message',   'message-error',  '');
    formError.textContent = '';
    formError.hidden = true;
  }

  function validate(name, email, interest, message) {
    var ok = true;
    if (!name)                          ok = !setError('full-name', 'name-error',     'Please enter your full name.');
    if (!email)                         ok = !setError('email',     'email-error',    'Please enter your email address.')   && ok;
    else if (!EMAIL_RE.test(email))     ok = !setError('email',     'email-error',    'Please enter a valid email address.') && ok;
    if (!interest)                      ok = !setError('interest',  'interest-error', 'Please select an area of interest.') && ok;
    if (!message)                       ok = !setError('message',   'message-error',  'Please tell us about your enquiry.') && ok;
    return ok;
  }

  /* ---- live clear on change ---- */
  [
    ['full-name', 'name-error'],
    ['email',     'email-error'],
    ['interest',  'interest-error'],
    ['message',   'message-error']
  ].forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    el.addEventListener('input', function () { setError(pair[0], pair[1], ''); });
    el.addEventListener('change', function () { setError(pair[0], pair[1], ''); });
  });

  /* ---- submit ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors();

    var name     = document.getElementById('full-name').value.trim();
    var email    = document.getElementById('email').value.trim();
    var phone    = document.getElementById('phone').value.trim();
    var interest = document.getElementById('interest').value;
    var message  = document.getElementById('message').value.trim();
    var honey    = form.querySelector('[name="_honey"]').value;

    // Silently discard if bot filled the honeypot
    if (honey) return;

    if (!validate(name, email, interest, message)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var payload = {
      name:     name,
      email:    email,
      phone:    phone || 'Not provided',
      interest: interest,
      message:  message,
      // FormSubmit helper fields
      _subject:  'New enquiry from Red Beacon Asset Management website',
      _template: 'table',
      _captcha:  'false'
    };

    fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':        'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Network response was not OK (' + res.status + ')');
      return res.json();
    })
    .then(function (data) {
      if (data.success === 'true' || data.success === true) {
        form.hidden = true;
        formSuccess.hidden = false;
        formSuccess.focus();
      } else {
        throw new Error('FormSubmit returned success=false');
      }
    })
    .catch(function () {
      formError.textContent =
        'Something went wrong — please try again, or email us directly.';
      formError.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';
    });
  });
}());
