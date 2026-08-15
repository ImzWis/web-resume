/* =========================================================
   Ely Ver Romantico — Web Resume
   Theme toggle, scroll spy, progress bar, reveal on scroll.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var STORAGE_KEY = 'resume-theme';
  var toggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(stored || (prefersDark.matches ? 'dark' : 'light'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  // Follow the OS only while the visitor hasn't made an explicit choice.
  prefersDark.addEventListener('change', function (e) {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ---------- Print ---------- */
  var printBtn = document.getElementById('print-btn');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Sticky bar + scroll progress ---------- */
  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('progress');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      if (topbar) topbar.classList.toggle('is-stuck', y > 8);

      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Stagger siblings so grids cascade rather than pop in together.
        var el = entry.target;
        var siblings = Array.prototype.slice.call(el.parentNode.children);
        var delay = Math.min(siblings.indexOf(el), 7) * 60;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countObserver.unobserve(el);

        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        var duration = 900;

        (function step(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Scroll spy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var visible = new Set();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      // Highlight the topmost section currently in view.
      var currentId = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible.has(sections[i].id)) { currentId = sections[i].id; break; }
      }

      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
      });
    }, { rootMargin: '-70px 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }
})();
