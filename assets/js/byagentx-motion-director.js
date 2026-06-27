(function(){
  'use strict';
  var root=document.documentElement;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stages=[
    {id:'hero',selector:'#top',label:'Promesa',node:0},
    {id:'offer',selector:'#websites',label:'Oferta',node:1},
    {id:'system',selector:'#sistema',label:'Sistema',node:2},
    {id:'demo',selector:'#ia-demo',label:'Demo',node:2},
    {id:'comparison',selector:'#diferencia',label:'Diferencia',node:3},
    {id:'proof',selector:'#proof',label:'Prueba',node:3},
    {id:'pricing',selector:'#precios',label:'Cotización',node:4},
    {id:'close',selector:'#contacto',label:'Cierre',node:4}
  ].map(function(s){s.el=document.querySelector(s.selector);return s;}).filter(function(s){return !!s.el;});
  var active=stages[0]&&stages[0].id || 'hero';
  var activeNode=0;
  var ticking=false;
  function createJourney(){
    var field=document.querySelector('.agentx-motion-field');
    if(!field||document.querySelector('.motion-journey'))return;
    var wrap=document.createElement('div');
    wrap.className='motion-journey';
    wrap.innerHTML='<span class="motion-journey-label">Pipeline AgentX</span><div class="journey-track"><span class="journey-node active"><b>Lead entra</b><small>web / WhatsApp</small></span><span class="journey-node"><b>IA responde</b><small>preguntas + intención</small></span><span class="journey-node"><b>Califica</b><small>necesidad + presupuesto</small></span><span class="journey-node"><b>Cotiza</b><small>paquete + siguiente paso</small></span><span class="journey-node"><b>Cierra</b><small>pago / handoff</small></span></div>';
    field.appendChild(wrap);
  }
  function addSystemPulse(){
    ['#sistema','#ia-demo','#precios','#contacto'].forEach(function(sel){var el=document.querySelector(sel);if(el&&!el.querySelector(':scope > .system-pulse')){var p=document.createElement('div');p.className='system-pulse';el.prepend(p);}});
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
  function init(){
    createJourney(); addSystemPulse();
    root.classList.add('motion-site-ready');
    root.dataset.motionStage=active;
    window.__agentxMotionSite={ready:true,version:'2026-06-system-motion',stage:active,progress:0,node:0,reducedMotion:!!reduced,stages:stages.map(function(s){return s.id;})};
    update();
    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request,{passive:true});
    document.addEventListener('visibilitychange',function(){call3D(document.hidden?'pause':'resume');});
    var tries=0;(function sync3d(){update();if((!window.__agentx3d||!window.__agentx3d.narrativeApi)&&tries++<90)requestAnimationFrame(sync3d);})();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
