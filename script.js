/* ============================================================
   Shaik Abdul Aziz & Shaik Kowsar Tasneem — site script
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (!reducedMotion && window.Lenis){
    lenis = new Lenis({ lerp:0.1, smoothWheel:true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{ lenis.raf(time*1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- Opening sequence ---------------- */
  const openingEl = document.getElementById('opening');
  const video = document.getElementById('opening-video');
  const skipBtn = document.getElementById('skip-btn');
  const openInvitationBtn = document.getElementById('open-invitation-btn');
  const music = document.getElementById('bg-music');
  const musicFab = document.getElementById('music-fab');

  let openingDone = false;
  let musicStarted = false;
  let videoStarted = false;

  // Start both music and video
  function startExperience() {
    if (videoStarted) return;
    videoStarted = true;

    // Hide the open invitation button
    if (openInvitationBtn) {
      openInvitationBtn.classList.add('hidden');
    }

    // Show skip button
    if (skipBtn) {
      skipBtn.classList.add('visible');
    }

    // Start music
    if (music && !musicStarted) {
      music.currentTime = 0;
      music.volume = 0.55;
      music.play().then(() => {
        musicStarted = true;
        if (musicFab) { 
          musicFab.classList.add('playing'); 
          musicFab.classList.remove('needs-tap'); 
        }
      }).catch(() => {
        console.log('Music autoplay blocked');
      });
    }

    // Start video
    if (video) {
      video.play().catch(() => {
        console.log('Video autoplay blocked');
      });
    }
  }

  function finishOpening(){
    if (openingDone) return;
    openingDone = true;
    gsap.to(openingEl, {
      opacity:0, duration:.9, ease:'power2.inOut',
      onComplete: () => {
        openingEl.style.display = 'none';
        document.body.style.overflow = 'auto';
        introReveal();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    });
  }

  document.body.style.overflow = 'hidden';
  
  // Open Invitation button click handler
  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', startExperience);
  }

  // Video ended handler
  if (video) {
    video.addEventListener('ended', finishOpening);
  }

  // Fallback timeout
  setTimeout(() => {
    if (!videoStarted) {
      // If user hasn't clicked yet, just finish opening
      finishOpening();
    }
  }, 30000); // 30s timeout if user doesn't interact

  // Skip button handler
  if (skipBtn) {
    skipBtn.addEventListener('click', finishOpening);
  }

  function introReveal(){
    gsap.fromTo('#hero .reveal',
      { opacity:0, y:50, filter:'blur(6px)' },
      { opacity:1, y:0, filter:'blur(0px)', duration:1.2, stagger:.15, ease:'power3.out' }
    );
  }

  /* ---------------- Nav ---------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------------- Scroll reveals ---------------- */
  gsap.utils.toArray('.reveal').forEach(el => {
    if (el.closest('#hero')) return; // handled by intro
    gsap.fromTo(el, { opacity:0, y:44, filter:'blur(4px)' }, {
      opacity:1, y:0, filter:'blur(0px)', duration:1.1, ease:'power3.out',
      scrollTrigger:{ trigger: el, start:'top 90%' }
    });
  });

  gsap.utils.toArray('.stagger-group').forEach(group => {
    gsap.fromTo(group.children, { opacity:0, y:50 }, {
      opacity:1, y:0, duration:.9, stagger:.15, ease:'power3.out',
      scrollTrigger:{ trigger: group, start:'top 90%' }
    });
  });

  /* ---------------- Floating particles (hero) ---------------- */
  const particleWrap = document.querySelector('.particles');
  if (particleWrap && !reducedMotion){
    for (let i=0;i<26;i++){
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 2 + Math.random()*4;
      p.style.width = p.style.height = size+'px';
      p.style.left = Math.random()*100+'%';
      p.style.top = Math.random()*100+'%';
      particleWrap.appendChild(p);
      gsap.to(p, {
        y: -80 - Math.random()*120,
        x: (Math.random()-0.5)*60,
        opacity:0,
        duration: 6+Math.random()*6,
        repeat:-1,
        delay: Math.random()*6,
        ease:'sine.inOut'
      });
    }
  }

  /* ---------------- Countdown ---------------- */
  const weddingDate = new Date('2026-09-24T12:30:00+05:30').getTime();
  const dEl=document.getElementById('cd-days'), hEl=document.getElementById('cd-hours'),
        mEl=document.getElementById('cd-mins'), sEl=document.getElementById('cd-secs');
  if (dEl && hEl && mEl && sEl) {
    function tick(){
      const now = Date.now();
      let diff = Math.max(0, weddingDate - now);
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      dEl.textContent = String(d).padStart(2,'0');
      hEl.textContent = String(h).padStart(2,'0');
      mEl.textContent = String(m).padStart(2,'0');
      sEl.textContent = String(s).padStart(2,'0');
    }
    tick(); setInterval(tick,1000);
  }

  /* ---------------- Floating controls ---------------- */
  const fabs = document.querySelectorAll('.fab');
  window.addEventListener('scroll', () => {
    fabs.forEach(f => { if (f !== musicFab) f.classList.toggle('visible', window.scrollY > 200); });
  });
  if (musicFab) musicFab.classList.add('visible', 'needs-tap');

  if (musicFab && music) {
    musicFab.addEventListener('click', () => {
      if (music.paused){
        music.play(); musicStarted = true; musicFab.classList.add('playing'); musicFab.classList.remove('needs-tap'); musicFab.textContent = '♫';
      } else {
        music.pause(); musicFab.classList.remove('playing');
      }
    });
  }

  const waFab = document.getElementById('whatsapp-fab');
  if (waFab) {
    waFab.addEventListener('click', () => {
      const text = encodeURIComponent('You are invited! Shaik Abdul Aziz & Shaik Kowsar Tasneem — 24–25 September 2026. ' + window.location.href);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }

  const topFab = document.getElementById('top-fab');
  if (topFab) {
    topFab.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0); else window.scrollTo({top:0,behavior:'smooth'});
    });
  }

  /* ---------------- Branding badge + modal ---------------- */
  const acBadge = document.getElementById('ac-badge');
  const acModal = document.getElementById('ac-modal');

  if (acBadge && acModal) {
    /* Detect this site's theme from its own design tokens */
    const rootCS = getComputedStyle(document.documentElement);
    const token = (name, fb) => (rootCS.getPropertyValue(name) || '').trim() || fb;

    const accent = token('--gold', '#C9A050');
    const fonts = {
      display: token('--font-display', "'Cormorant Garamond', serif"),
      sub: token('--font-sub', "'Playfair Display', serif"),
      body: token('--font-body', "'Poppins', sans-serif")
    };

    /* Detect background tone: light ivory vs dark theme */
    const rgb = (getComputedStyle(document.body).backgroundColor || '').match(/[\d.]+/g);
    let tone = 'light';
    if (rgb) {
      const r = +rgb[0], g = +rgb[1], b = +rgb[2];
      const a = rgb[3] !== undefined ? +rgb[3] : 1;
      if (a > 0 && (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5) tone = 'dark';
    }

    [acBadge, acModal].forEach(el => {
      el.dataset.acTone = tone;
      el.style.setProperty('--ac-accent', accent);
      el.style.setProperty('--ac-font-display', fonts.display);
      el.style.setProperty('--ac-font-sub', fonts.sub);
      el.style.setProperty('--ac-font-body', fonts.body);
    });

    /* Badge state toggle: pill (hero) <-> compact icon (scrolled) */
    const heroEl = document.getElementById('hero');
    const mqMobile = window.matchMedia('(max-width: 640px)');
    let pastHero = false;

    const applyBadgeState = () => {
      acBadge.classList.toggle('is-compact', pastHero || mqMobile.matches);
    };

    if ('IntersectionObserver' in window && heroEl) {
      const io = new IntersectionObserver(entries => {
        const e = entries[0];
        if (!e || e.target !== heroEl) return;
        pastHero = e.intersectionRatio <= 0.2;
        applyBadgeState();
      }, { threshold: [0, 0.2, 0.5, 1] });
      io.observe(heroEl);
    } else {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          pastHero = window.scrollY > window.innerHeight * 0.8;
          applyBadgeState();
          ticking = false;
        });
      }, { passive: true });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyBadgeState, 120);
    });
    applyBadgeState();

    /* Modal open/close — only ever opened via the badge, never auto */
    let lastFocused = null;

    const openAcModal = () => {
      lastFocused = document.activeElement;
      acModal.classList.add('is-open');
      acModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      const closeBtn = acModal.querySelector('.ac-modal-close');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    };

    const closeAcModal = () => {
      acModal.classList.remove('is-open');
      acModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
    };

    acBadge.addEventListener('click', openAcModal);

    acModal.addEventListener('click', e => {
      if (e.target === acModal || (e.target.closest && e.target.closest('[data-close]'))) {
        closeAcModal();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && acModal.classList.contains('is-open')) closeAcModal();
    });
  }

  /* First user interaction unlocks audio if autoplay was blocked */
  const unlockAudio = () => {
    if (!musicStarted && music) {
      music.play().then(() => {
        musicStarted = true;
        if (musicFab) { 
          musicFab.classList.add('playing'); 
          musicFab.classList.remove('needs-tap'); 
        }
      }).catch(() => {});
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('touchend', unlockAudio);
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio, { passive:true });
  window.addEventListener('touchend', unlockAudio, { passive:true });
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

});
