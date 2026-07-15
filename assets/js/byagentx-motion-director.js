(function(){
  'use strict';

  var VERSION = '20260715-motion3d-v3';
  var root = document.documentElement;
  var reducedQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var desktopQuery = window.matchMedia ? window.matchMedia('(min-width: 900px)') : null;
  var finePointerQuery = window.matchMedia ? window.matchMedia('(pointer: fine)') : null;
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var reduced = !!(reducedQuery && reducedQuery.matches);
  var saveData = !!(connection && connection.saveData);
  var richMotion = !!(desktopQuery && desktopQuery.matches && !reduced && !saveData);

  var stageDefinitions = [
    { id: 'hero', selector: '.hero', node: 0 },
    { id: 'offer', selector: '#sistema', node: 1 },
    { id: 'system', selector: '#como-opera', node: 2 },
    { id: 'proof', selector: '#casos', node: 4 },
    { id: 'pricing', selector: '#precios', node: 3 },
    { id: 'close', selector: '#contacto', node: 4 }
  ];
  var stages = stageDefinitions.map(function(definition){
    return {
      id: definition.id,
      selector: definition.selector,
      node: definition.node,
      el: document.querySelector(definition.selector)
    };
  }).filter(function(stage){ return !!stage.el; });

  var active = stages[0] || { id: 'hero', node: 0, el: document.body };
  var ticking = false;
  var lenis = null;
  var lenisTicker = null;
  var magneticReady = false;

  var readiness = {
    ready: false,
    version: VERSION,
    siteWide: true,
    reducedMotion: reduced,
    saveData: saveData,
    richMotion: richMotion,
    smoothScroll: false,
    stage: active.id,
    progress: 0,
    pageProgress: 0,
    node: active.node,
    stages: stages.map(function(stage){ return stage.id; }),
    get real3D(){ return !!(window.__agentx3d && window.__agentx3d.realGeometry); },
    get threeStatus(){ return window.__agentx3d ? window.__agentx3d.status : 'pending'; }
  };
  window.__agentxMotionSite = readiness;

  function clamp01(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  function call3D(method, argument) {
    var api = window.__agentx3d;
    if (!api || typeof api[method] !== 'function') return;
    try { api[method](argument); } catch (error) {}
  }

  function progressFor(element) {
    var rect = element.getBoundingClientRect();
    var viewport = window.innerHeight || 800;
    return clamp01((viewport - rect.top) / Math.max(1, rect.height + viewport));
  }

  function findClosestStage() {
    var viewportFocus = (window.innerHeight || 800) * 0.46;
    var closest = stages[0] || active;
    var closestDistance = Number.POSITIVE_INFINITY;
    stages.forEach(function(stage){
      var rect = stage.el.getBoundingClientRect();
      var center = rect.top + rect.height * 0.46;
      var distance = Math.abs(center - viewportFocus);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = stage;
      }
    });
    return closest;
  }

  function updateSectionMotion(stage, progress, isActive) {
    stage.el.classList.toggle('stage-active', isActive);
    stage.el.style.setProperty('--stage-progress', progress.toFixed(4));
    stage.el.style.setProperty('--media-y', ((0.5 - progress) * 34).toFixed(2) + 'px');
    stage.el.style.setProperty('--content-shift', isActive && richMotion ? ((0.5 - progress) * 12).toFixed(2) + 'px' : '0px');
    stage.el.style.setProperty('--card-shift', isActive && richMotion ? ((0.5 - progress) * 8).toFixed(2) + 'px' : '0px');
  }

  function update() {
    ticking = false;
    if (!stages.length) return;

    active = findClosestStage();
    var stageProgress = progressFor(active.el);
    var pageScrollable = Math.max(1, document.documentElement.scrollHeight - (window.innerHeight || 0));
    var pageProgress = clamp01((window.scrollY || window.pageYOffset || 0) / pageScrollable);

    stages.forEach(function(stage){
      updateSectionMotion(stage, progressFor(stage.el), stage === active);
    });

    root.dataset.motionStage = active.id;
    root.dataset.spatialNode = String(active.node);
    root.style.setProperty('--ax-stage-progress', stageProgress.toFixed(4));
    root.style.setProperty('--ax-page-progress', pageProgress.toFixed(4));
    root.style.setProperty('--stage-progress', stageProgress.toFixed(4));
    root.style.setProperty('--motion-progress', pageProgress.toFixed(4));

    readiness.stage = active.id;
    readiness.progress = stageProgress;
    readiness.pageProgress = pageProgress;
    readiness.node = active.node;
    readiness.reducedMotion = reduced;
    readiness.saveData = saveData;
    readiness.richMotion = richMotion;
    readiness.ready = true;

    call3D('setScene', active.id);
    call3D('setProgress', stageProgress);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function destroySmoothScroll() {
    if (!lenis) return;
    try {
      if (lenisTicker && window.gsap) window.gsap.ticker.remove(lenisTicker);
      if (typeof lenis.destroy === 'function') lenis.destroy();
    } catch (error) {}
    lenis = null;
    lenisTicker = null;
    readiness.smoothScroll = false;
    delete window.__agentxLenis;
  }

  function initSmoothScroll() {
    if (!richMotion || lenis || !window.Lenis) return;
    try {
      lenis = new window.Lenis({
        lerp: 0.105,
        wheelMultiplier: 0.9,
        smoothWheel: true,
        syncTouch: false
      });
      lenis.on('scroll', function(){
        requestUpdate();
        if (window.ScrollTrigger) window.ScrollTrigger.update();
      });
      if (window.gsap) {
        lenisTicker = function(time){ lenis.raf(time * 1000); };
        window.gsap.ticker.add(lenisTicker);
      } else {
        (function frame(time){
          if (!lenis) return;
          lenis.raf(time);
          window.requestAnimationFrame(frame);
        })(performance.now());
      }
      readiness.smoothScroll = true;
      window.__agentxLenis = lenis;
    } catch (error) {
      destroySmoothScroll();
    }
  }

  function syncPolicy() {
    reduced = !!(reducedQuery && reducedQuery.matches);
    saveData = !!(connection && connection.saveData);
    richMotion = !!(desktopQuery && desktopQuery.matches && !reduced && !saveData);
    root.classList.toggle('rich-motion', richMotion);
    if (richMotion) initSmoothScroll();
    else destroySmoothScroll();
    readiness.reducedMotion = reduced;
    readiness.saveData = saveData;
    readiness.richMotion = richMotion;
    requestUpdate();
  }

  function initMagneticInteractions() {
    if (magneticReady || !(finePointerQuery && finePointerQuery.matches) || !window.gsap) return;
    magneticReady = true;
    var selector = '.btn,.prompt-chip,.proof a,.card:not(.price-card)';
    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function(element){
      element.classList.add('magnetic');
      element.addEventListener('pointermove', function(event){
        if (!richMotion) return;
        var rect = element.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.11;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.11;
        window.gsap.to(element, { x: x, y: y, duration: 0.28, ease: 'power3.out', overwrite: true });
      });
      element.addEventListener('pointerleave', function(){
        window.gsap.to(element, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, .42)', overwrite: true });
      });
    });
  }

  function onAnchorClick(event) {
    if (!lenis) return;
    var anchor = event.target.closest && event.target.closest('a[href^="#"]');
    if (!anchor) return;
    var href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    var target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: -70, duration: 0.9 });
    if (window.history && window.history.pushState) window.history.pushState(null, '', href);
  }

  function onVisibilityChange() {
    call3D(document.hidden ? 'pause' : 'resume');
    if (!lenis) return;
    if (document.hidden && typeof lenis.stop === 'function') lenis.stop();
    if (!document.hidden && typeof lenis.start === 'function') lenis.start();
  }

  function addQueryListener(query, handler) {
    if (!query) return;
    if (typeof query.addEventListener === 'function') query.addEventListener('change', handler);
    else if (typeof query.addListener === 'function') query.addListener(handler);
  }

  function init() {
    root.classList.add('motion-site-ready');
    root.dataset.motionStage = active.id;
    root.dataset.spatialNode = String(active.node);
    syncPolicy();
    initMagneticInteractions();
    update();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('agentx:3d-ready', update);
    document.addEventListener('click', onAnchorClick);
    document.addEventListener('visibilitychange', onVisibilityChange);
    addQueryListener(reducedQuery, syncPolicy);
    addQueryListener(desktopQuery, syncPolicy);
    if (connection && typeof connection.addEventListener === 'function') connection.addEventListener('change', syncPolicy);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();