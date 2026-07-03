(function(){
  'use strict';
  var root=document.documentElement;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stages=[
    {id:'hero',selector:'#top',label:'Promesa',node:0},
    {id:'offer',selector:'#sales-os',label:'Sistema',node:1},
    {id:'system',selector:'#stack',label:'Stack',node:2},
    {id:'demo',selector:'#ia-demo',label:'Demo',node:2},
    {id:'comparison',selector:'#diferencia',label:'Diferencia',node:3},
    {id:'proof',selector:'#proof',label:'Prueba',node:3},
    {id:'pricing',selector:'#precios',label:'Cotización',node:4},
    {id:'close',selector:'#contacto',label:'Cierre',node:4}
  ].map(function(s){s.el=document.querySelector(s.selector);return s;}).filter(function(s){return !!s.el;});
  var active=stages[0]&&stages[0].id || 'hero';
  var activeNode=0;
  var ticking=false;
  var lenis=null;

  function createJourney(){
    var field=document.querySelector('.agentx-motion-field');
    if(!field||document.querySelector('.motion-journey'))return;
    var wrap=document.createElement('div');
    wrap.className='motion-journey';
    wrap.innerHTML='<span class="motion-journey-label">Pipeline AgentX</span><div class="journey-track"><span class="journey-node active"><b>Lead entra</b><small>web / WhatsApp</small></span><span class="journey-node"><b>IA responde</b><small>preguntas + intención</small></span><span class="journey-node"><b>Califica</b><small>necesidad + presupuesto</small></span><span class="journey-node"><b>Cotiza</b><small>paquete + siguiente paso</small></span><span class="journey-node"><b>Cierra</b><small>pago / handoff</small></span></div>';
    field.appendChild(wrap);
  }
  function addSystemPulse(){
    ['#sales-os','#stack','#sistema','#ia-demo','#precios','#contacto'].forEach(function(sel){var el=document.querySelector(sel);if(el&&!el.querySelector(':scope > .system-pulse')){var p=document.createElement('div');p.className='system-pulse';el.prepend(p);}});
  }
  function setJourneyNode(index){
    activeNode=index;
    document.querySelectorAll('.journey-node').forEach(function(node,i){node.classList.toggle('active',i===index);node.classList.toggle('done',i<index);});
  }
  function stageProgress(el){
    var r=el.getBoundingClientRect();
    var vh=window.innerHeight||800;
    var total=Math.max(1,r.height+vh);
    return Math.max(0,Math.min(1,(vh-r.top)/total));
  }
  function closestStage(){
    var mid=(window.innerHeight||800)*0.48;
    var best=stages[0]; var bestD=1e9;
    stages.forEach(function(s){var r=s.el.getBoundingClientRect();var center=r.top+r.height*.42;var d=Math.abs(center-mid);if(d<bestD){bestD=d;best=s;}});
    return best;
  }
  function call3D(method,arg){
    var api=window.__agentx3d;
    if(api&&typeof api[method]==='function'){
      try{api[method](arg);}catch(e){}
    }
  }
  function update(){
    ticking=false;
    if(!stages.length)return;
    var s=closestStage();
    var p=stageProgress(s.el);
    active=s.id;
    root.dataset.motionStage=s.id;
    root.style.setProperty('--stage-progress',p.toFixed(3));
    root.style.setProperty('--motion-progress',((window.scrollY||0)/Math.max(1,document.documentElement.scrollHeight-window.innerHeight)).toFixed(3));
    stages.forEach(function(item){item.el.classList.toggle('stage-active',item.id===s.id);item.el.classList.add('motion-aware');item.el.style.setProperty('--stage-progress',item.id===s.id?p.toFixed(3):'0');});
    setJourneyNode(s.node||0);
    call3D('setScene',s.id);
    call3D('setProgress',p);
    if(window.__agentxMotionSite){window.__agentxMotionSite.stage=s.id;window.__agentxMotionSite.progress=p;window.__agentxMotionSite.node=activeNode;}
  }
  function request(){if(!ticking){ticking=true;requestAnimationFrame(update);}}

  function initSmoothScroll(){
    if(reduced||!window.Lenis)return null;
    try{
      lenis=new window.Lenis({lerp:0.085,wheelMultiplier:0.9,smoothWheel:true,syncTouch:false});
      root.classList.add('agentx-smooth-ready');
      lenis.on('scroll',function(){request(); if(window.ScrollTrigger)window.ScrollTrigger.update();});
      if(window.gsap){window.gsap.ticker.add(function(time){lenis.raf(time*1000);}); window.gsap.ticker.lagSmoothing(0);} else {function raf(time){lenis.raf(time);requestAnimationFrame(raf);}requestAnimationFrame(raf);}
      document.addEventListener('click',function(e){
        var a=e.target.closest&&e.target.closest('a[href^="#"]');
        if(!a)return;
        var href=a.getAttribute('href');
        if(!href||href==='#')return;
        var target=document.querySelector(href);
        if(!target)return;
        e.preventDefault();
        lenis.scrollTo(target,{offset:-76,duration:1.05});
        if(history&&history.pushState)history.pushState(null,'',href);
      });
      window.__agentxLenis=lenis;
      return lenis;
    }catch(e){return null;}
  }

  function initGsapNarrative(){
    var gsap=window.gsap, ScrollTrigger=window.ScrollTrigger;
    if(!gsap||!ScrollTrigger||reduced)return;
    try{gsap.registerPlugin(ScrollTrigger);}catch(e){}
    root.classList.add('motion-pro-ready');
    gsap.from('.template-headline .hline',{y:34,opacity:0,filter:'blur(8px)',duration:0.9,stagger:0.12,ease:'power3.out',delay:0.08});
    gsap.from('.eyebrow,.lead,.agentx-dashboard,.hero-actions,.tiny,.guarantee-note,.focus-row',{y:18,opacity:0,duration:0.74,stagger:0.08,ease:'power3.out',delay:0.22});
    gsap.from('.agentx-dashboard .dash-row,.agentx-dashboard .dash-chip,.agentx-dashboard .dash-score',{y:12,opacity:0,duration:0.55,stagger:0.045,ease:'power2.out',delay:0.46});
    gsap.from('.os-step,.console-flow div',{y:18,opacity:0,duration:0.58,stagger:0.055,ease:'power2.out',scrollTrigger:{trigger:'#sales-os',start:'top 78%',once:true}});
    gsap.from('.stack-card',{y:18,opacity:0,duration:0.55,stagger:0.045,ease:'power2.out',scrollTrigger:{trigger:'#stack',start:'top 78%',once:true}});
    gsap.utils.toArray('.comparison-card li').forEach(function(li,i){
      gsap.from(li,{x:li.closest('.regina')?18:-18,opacity:0,duration:0.48,ease:'power2.out',scrollTrigger:{trigger:li,start:'top 88%',once:true},delay:(i%4)*0.025});
    });
    gsap.from('.price-card',{y:24,opacity:0,stagger:0.08,duration:0.62,ease:'power2.out',scrollTrigger:{trigger:'#precios',start:'top 72%',once:true}});
    gsap.to('.journey-node',{y:-3,stagger:0.08,ease:'power1.inOut',scrollTrigger:{trigger:'#sales-os',start:'top 72%',end:'#ia-demo top',scrub:0.6}});
  }

  function initCountUps(){
    var nodes=[].slice.call(document.querySelectorAll('[data-count]'));
    if(!nodes.length)return;
    function setValue(el,value){
      var prefix=el.getAttribute('data-prefix')||'';
      var suffix=el.getAttribute('data-suffix')||'';
      el.textContent=prefix+String(Math.round(value))+suffix;
    }
    function animate(el){
      if(el.dataset.counted)return;
      el.dataset.counted='true';
      var end=Number(el.getAttribute('data-count'))||0;
      if(reduced){setValue(el,end);return;}
      var startTime=performance.now();
      var dur=950;
      function step(now){
        var t=Math.min(1,(now-startTime)/dur);
        var eased=1-Math.pow(1-t,3);
        setValue(el,end*eased);
        if(t<1)requestAnimationFrame(step);else setValue(el,end);
      }
      requestAnimationFrame(step);
    }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){animate(entry.target);io.unobserve(entry.target);}});},{threshold:.4});
      nodes.forEach(function(el){io.observe(el);});
    }else{nodes.forEach(animate);}
  }

  function init(){
    createJourney(); addSystemPulse(); initSmoothScroll(); initGsapNarrative(); initCountUps();
    root.classList.add('motion-site-ready');
    root.dataset.motionStage=active;
    window.__agentxMotionSite={ready:true,version:'2026-07-saas-polish',stage:active,progress:0,node:0,reducedMotion:!!reduced,stages:stages.map(function(s){return s.id;})};
    update();
    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request,{passive:true});
    document.addEventListener('visibilitychange',function(){call3D(document.hidden?'pause':'resume');});
    var tries=0;(function sync3d(){update();if((!window.__agentx3d||!window.__agentx3d.narrativeApi)&&tries++<90)requestAnimationFrame(sync3d);})();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
