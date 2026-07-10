(function(){
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stages = [
    { id: 'hero', selector: '.hero', node: 0 },
    { id: 'offer', selector: '#sistema', node: 1 },
    { id: 'system', selector: '#como-opera', node: 2 },
    { id: 'proof', selector: '#casos', node: 3 },
    { id: 'pricing', selector: '#precios', node: 4 },
    { id: 'close', selector: '#contacto', node: 4 }
  ].map(function(s){
    s.el = document.querySelector(s.selector);
    return s;
  }).filter(function(s){ return !!s.el; });

  var active = stages[0] ? stages[0].id : 'hero';
  var ticking = false;
  var lenis = null;

  function call3D(method, arg) {
    var api = window.__agentx3d;
    if (api && typeof api[method] === 'function') {
      try { api[method](arg); } catch (e) {}
    }
  }

  function stageProgress(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    var total = Math.max(1, r.height + vh);
    return Math.max(0, Math.min(1, (vh - r.top) / total));
  }

  function closestStage() {
    var mid = (window.innerHeight || 800) * 0.46;
    var best = stages[0];
    var bestDist = 1e9;
    stages.forEach(function(stage){
      var r = stage.el.getBoundingClientRect();
      var center = r.top + r.height * 0.45;
      var dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = stage;
      }
    });
    return best;
  }

  function update() {
    ticking = false;
    if (!stages.length) return;

    var current = closestStage();
    var progress = stageProgress(current.el);

    active = current.id;
    root.dataset.motionStage = current.id;
    root.style.setProperty('--stage-progress', progress.toFixed(3));
    root.style.setProperty('--motion-progress', ((window.scrollY || 0) / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)).toFixed(3));

    stages.forEach(function(stage){
      stage.el.classList.toggle('stage-active', stage.id === current.id);
      stage.el.style.setProperty('--stage-progress', stage.id === current.id ? progress.toFixed(3) : '0');
    });

    call3D('setScene', current.id);
    call3D('setProgress', progress);

    window.__agentxMotionSite = {
      ready: true,
      version: '20260709-flagship',
      reducedMotion: !!reduced,
      stage: current.id,
      progress: progress,
      node: current.node,
      stages: stages.map(function(s){ return s.id; })
    };
  }

  function request() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function initSmoothScroll() {
    if (reduced || !window.Lenis) return;
    try {
      lenis = new window.Lenis({
        lerp: 0.09,
        wheelMultiplier: 0.92,
        smoothWheel: true,
        syncTouch: false
      });
      lenis.on('scroll', function(){
        request();
        if (window.ScrollTrigger) window.ScrollTrigger.update();
      });
      if (window.gsap) {
        window.gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      } else {
        var raf = function(time){ lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }

      document.addEventListener('click', function(e){
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.0 });
        if (history && history.pushState) history.pushState(null, '', href);
      });

      window.__agentxLenis = lenis;
    } catch (e) {}
  }

  function pauseHeavyMotionWhenHidden() {
    document.addEventListener('visibilitychange', function(){
      call3D(document.hidden ? 'pause' : 'resume');
      if (lenis) {
        if (document.hidden && typeof lenis.stop === 'function') lenis.stop();
        if (!document.hidden && typeof lenis.start === 'function') lenis.start();
      }
    });
  }

  function init() {
    initSmoothScroll();
    pauseHeavyMotionWhenHidden();
    root.classList.add('motion-site-ready');
    root.dataset.motionStage = active;
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });

    var tries = 0;
    (function sync3d(){
      update();
      if ((!window.__agentx3d || !window.__agentx3d.narrativeApi) && tries++ < 120) {
        requestAnimationFrame(sync3d);
      }
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
