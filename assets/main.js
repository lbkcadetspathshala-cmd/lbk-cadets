/* ===== CONFIG — LBK Cadets Pathshala ===== */
var WA_NUMBER = "918859425252";
var WA_DEFAULT_MSG = "Namaste! Mujhe LBK Cadets Pathshala ke admission ki jaankari chahiye.";

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile menu toggle */
  var hamb = document.getElementById('hamb'), menu = document.getElementById('menu');
  if (hamb && menu) {
    hamb.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  /* Courses dropdown: auto-open on hover, auto-close on mouse leave (desktop) */
  document.querySelectorAll('nav.menu details.drop').forEach(function (det) {
    var closeTimer;
    det.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      det.setAttribute('open', '');
    });
    det.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(function () { det.removeAttribute('open'); }, 180);
    });
  });

  /* WhatsApp links (data-wa attribute, optional data-wa-msg override) */
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    var msg = el.getAttribute('data-wa-msg') || WA_DEFAULT_MSG;
    el.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    el.target = "_blank";
    el.rel = "noopener";
  });

  /* Hero background image slider: auto crossfade + dots (fast) */
  (function () {
    var slider = document.getElementById('heroSlider');
    if (!slider) return;
    var slides = slider.querySelectorAll('.hs-slide');
    var dotsWrap = document.getElementById('heroDots');
    var idx = 0;
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) b.className = 'active';
      b.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll('button');
    function goTo(i) {
      slides[idx].classList.remove('active');
      dots[idx].classList.remove('active');
      idx = i;
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
    }
    var heroTimer = setInterval(function () { goTo((idx + 1) % slides.length); }, 2200);
    slider.parentElement.addEventListener('mouseenter', function () { clearInterval(heroTimer); });
    slider.parentElement.addEventListener('mouseleave', function () {
      heroTimer = setInterval(function () { goTo((idx + 1) % slides.length); }, 2200);
    });
  })();

  /* Course logo slider: auto-scroll + manual arrows */
  (function () {
    var track = document.getElementById('csTrack');
    var prev = document.getElementById('csPrev'), next = document.getElementById('csNext');
    if (!track) return;
    function step() { return (track.querySelector('.cs-slide').offsetWidth + 20); }
    function scrollByDir(dir) {
      var max = track.scrollWidth - track.clientWidth;
      var target = track.scrollLeft + dir * step();
      if (target < 0) target = max; else if (target > max) target = 0;
      track.scrollTo({ left: target, behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { scrollByDir(-1); resetAuto(); });
    if (next) next.addEventListener('click', function () { scrollByDir(1); resetAuto(); });
    var auto = setInterval(function () { scrollByDir(1); }, 3200);
    function resetAuto() { clearInterval(auto); auto = setInterval(function () { scrollByDir(1); }, 3200); }
    track.addEventListener('mouseenter', function () { clearInterval(auto); });
    track.addEventListener('mouseleave', function () { resetAuto(); });
    track.addEventListener('touchstart', function () { clearInterval(auto); }, { passive: true });
    track.addEventListener('touchend', function () { resetAuto(); }, { passive: true });
  })();

  /* Countdown timer */
  (function () {
    var d = document.getElementById('d'), h = document.getElementById('h'),
        m = document.getElementById('m'), s = document.getElementById('s');
    if (!d) return;
    var deadline = Date.now() + 4 * 864e5 + 12 * 36e5 + 34 * 6e4;
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var diff = deadline - Date.now(); if (diff < 0) diff = 0;
      d.textContent = pad(Math.floor(diff / 864e5));
      h.textContent = pad(Math.floor(diff % 864e5 / 36e5));
      m.textContent = pad(Math.floor(diff % 36e5 / 6e4));
      s.textContent = pad(Math.floor(diff % 6e4 / 1e3));
    }
    tick(); setInterval(tick, 1000);
  })();

  /* Lead forms -> WhatsApp */
  document.querySelectorAll('.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fd = new FormData(form);
      var extraMsg = fd.get('message');
      var msg = "🎓 *Naya Lead — LBK Cadets Pathshala*%0a%0a"
        + "👤 Naam: " + (fd.get('name') || '-') + "%0a"
        + "📱 Mobile: " + (fd.get('phone') || '-') + "%0a"
        + "🎯 Course: " + (fd.get('course') || '-') + "%0a"
        + "📚 Class: " + (fd.get('grade') || '-') + "%0a"
        + (extraMsg ? "📝 Message: " + extraMsg + "%0a" : "")
        + "%0a" + "Kripya free counselling ke liye call karein.";
      var ok = form.querySelector('.form-ok'); if (ok) ok.style.display = 'block';
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + msg, "_blank");
      form.reset();
      var modalEl = document.getElementById('modal');
      if (modalEl) setTimeout(function () { modalEl.classList.remove('show'); }, 600);
    });
  });

  /* Reveal on scroll */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* Animated stat counters */
  var co = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, t = parseInt(el.dataset.c, 10);
      var suf = el.textContent.indexOf('%') > -1 ? '%' : (el.textContent.indexOf('+') > -1 ? '+' : '');
      var cur = 0, step = Math.max(1, Math.floor(t / 45));
      var iv = setInterval(function () { cur += step; if (cur >= t) { cur = t; clearInterval(iv); } el.textContent = cur + suf; }, 22);
      co.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('.stat .n').forEach(function (el) { co.observe(el); });

  /* Social-proof toasts */
  var proofs = [
    { n: "🎉 8,200+ students", a: "ab tak LBK se enroll ho chuke!" },
    { n: "Aman (Aligarh)", a: "ne abhi Navodaya batch join kiya" },
    { n: "Priya ki mummy", a: "ne free counselling book ki" },
    { n: "Rahul (Iglas)", a: "ne Sainik School prep join kiya" },
    { n: "Sneha (Hathras)", a: "ne abhi RIMC enquiry ki" },
    { n: "Mohd. Ayaan", a: "ne AMU batch ke liye apply kiya" },
    { n: "Kavya ke papa", a: "ne scholarship test book kiya" },
    { n: "🎉 350+ selections", a: "is saal government schools mein!" }
  ];
  var ti = 0, toast = document.getElementById('toast');
  if (toast) {
    function showToast() {
      var p = proofs[ti % proofs.length]; ti++;
      document.getElementById('toastAva').textContent = p.n.charAt(0).match(/[A-Za-z0-9]/) ? p.n.charAt(0) : '🎉';
      document.getElementById('toastName').textContent = p.n;
      document.getElementById('toastAct').textContent = p.a + " · abhi";
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 5000);
    }
    setTimeout(function () { showToast(); setInterval(showToast, 10000); }, 5000);
  }

  /* Exit / delayed lead popup */
  var modal = document.getElementById('modal'), shown = false;
  if (modal) {
    function openModal() {
      if (shown || sessionStorage.getItem('lbk_popup')) return;
      shown = true; sessionStorage.setItem('lbk_popup', '1');
      modal.classList.add('show');
    }
    var mclose = document.getElementById('mclose');
    if (mclose) mclose.addEventListener('click', function () { modal.classList.remove('show'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
    setTimeout(openModal, 18000);
    document.addEventListener('mouseout', function (e) { if (e.clientY <= 0) openModal(); });
  }

});
