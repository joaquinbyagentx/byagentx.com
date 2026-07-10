(function(){
  'use strict';

  var form = document.getElementById('liveSaleForm');
  if (!form) return;

  var input = document.getElementById('liveScenarioInput');
  var processBtn = document.getElementById('processLeadBtn');
  var resetBtn = document.getElementById('resetLiveDemoBtn');
  var choiceButtons = Array.prototype.slice.call(document.querySelectorAll('[data-live-scenario]'));
  var stageNodes = Array.prototype.slice.call(document.querySelectorAll('[data-live-stage]'));
  var fieldNodes = {};
  Array.prototype.slice.call(document.querySelectorAll('[data-live-field]')).forEach(function(el){
    fieldNodes[el.getAttribute('data-live-field')] = el;
  });

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var instantMode = reducedMotion || saveData;

  var activeScenario = 'clinic';
  var inputIsCustom = false;
  var running = false;
  var timerIds = [];
  var stages = ['signal', 'understand', 'decide', 'act'];
  var sceneByStage = {
    signal: 'offer',
    understand: 'system',
    decide: 'proof',
    act: 'pricing'
  };

  var scenarioCatalog = {
    clinic: {
      input: 'Tengo una clínica y recibo 80 mensajes al día.',
      intencion: 'Alta',
      urgencia: 'Alta',
      contexto: 'Clínica / 80 mensajes día / seguimiento manual',
      oferta: 'Web + Chat IA',
      confianza: '87%',
      accion: 'Preparar cotización + handoff a asesor'
    },
    restaurant: {
      input: 'Tengo un restaurante y quiero ordenar pedidos por WhatsApp.',
      intencion: 'Media-Alta',
      urgencia: 'Media',
      contexto: 'Restaurante / picos de hora / saturación por chat',
      oferta: 'WhatsApp Starter',
      confianza: '82%',
      accion: 'Activar flujo WhatsApp + CRM básico'
    },
    services: {
      input: 'Vendo servicios profesionales y necesito cotizar más rápido.',
      intencion: 'Alta',
      urgencia: 'Media-Alta',
      contexto: 'Servicios / tickets altos / respuesta lenta',
      oferta: 'Automation Stack',
      confianza: '79%',
      accion: 'Pipeline + cotización + seguimiento automático'
    }
  };

  function track(eventName, extras) {
    var payload = {
      event: eventName,
      location: 'hero_live_sale_console',
      offer: 'live_sale_demo',
      timestamp: new Date().toISOString()
    };
    if (extras && typeof extras === 'object') {
      Object.keys(extras).forEach(function(key){ payload[key] = extras[key]; });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }

  function setField(key, value) {
    var el = fieldNodes[key];
    if (el) el.textContent = value;
  }

  function setStage(stageName) {
    stageNodes.forEach(function(node){
      node.classList.toggle('active', node.getAttribute('data-live-stage') === stageName);
    });
    var api = window.__agentx3d;
    if (api && typeof api.setScene === 'function') {
      try { api.setScene(sceneByStage[stageName] || 'hero'); } catch (e) {}
    }
    if (api && typeof api.setProgress === 'function') {
      try { api.setProgress((stages.indexOf(stageName) + 1) / stages.length); } catch (e) {}
    }
  }

  function clearTimers() {
    timerIds.forEach(function(id){ clearTimeout(id); });
    timerIds = [];
  }

  function resetDemo(message) {
    clearTimers();
    running = false;
    stages.forEach(function(stage){
      var node = document.querySelector('[data-live-stage="' + stage + '"]');
      if (node) node.classList.toggle('active', stage === 'signal');
    });
    setField('intencion', 'Pendiente');
    setField('urgencia', 'Pendiente');
    setField('contexto', 'Pendiente');
    setField('oferta', 'Pendiente');
    setField('confianza', '--');
    setField('accion', 'Pendiente');
    setField('ruta', 'WhatsApp \u2192 AgentX \u2192 CRM \u2192 Cotizaci\u00f3n/Handoff');
    setField('status', message || 'Listo para ejecutar demo.');
    if (processBtn) processBtn.disabled = false;
  }

  function getScenarioData() {
    var typed = (input && input.value || '').trim();
    if (typed && inputIsCustom) {
      return {
        input: typed,
        intencion: 'Alta',
        urgencia: 'Media-Alta',
        contexto: typed.length > 64 ? typed.slice(0, 64) + '…' : typed,
        oferta: 'Diagnóstico Express IA',
        confianza: '74%',
        accion: 'Calificación inicial + recomendación de configuración'
      };
    }
    return scenarioCatalog[activeScenario] || scenarioCatalog.clinic;
  }

  function applyStageSnapshot(stage, data) {
    if (stage === 'signal') {
      setField('status', 'Signal: lead detectado y normalizado para evaluación.');
      setField('intencion', 'Detectando');
      setField('urgencia', 'Detectando');
      setField('contexto', data.contexto.split('/')[0].trim() || data.contexto);
      setField('ruta', 'WhatsApp \u2192 AgentX \u2192 CRM \u2192 Cotización/Handoff');
      return;
    }
    if (stage === 'understand') {
      setField('status', 'Understand: AgentX interpreta intención, urgencia y contexto.');
      setField('intencion', data.intencion);
      setField('urgencia', data.urgencia);
      setField('contexto', data.contexto);
      return;
    }
    if (stage === 'decide') {
      setField('status', 'Decide: se propone oferta y siguiente acción comercial.');
      setField('oferta', data.oferta);
      setField('confianza', data.confianza + ' (estimación demo)');
      setField('accion', data.accion);
      return;
    }
    if (stage === 'act') {
      setField('status', 'Act: CRM actualizado / cotización preparada / handoff disponible.');
      setField('ruta', 'WhatsApp \u2192 AgentX \u2192 CRM actualizado \u2192 Cotización lista / Handoff');
      setField('accion', 'CRM actualizado / cotización preparada / handoff disponible');
    }
  }

  function runDemo() {
    if (running) return;
    var data = getScenarioData();

    running = true;
    if (processBtn) processBtn.disabled = true;

    track('live_sale_demo_start', {
      scenario: activeScenario,
      mode: instantMode ? 'instant' : 'animated',
      has_custom_input: inputIsCustom
    });

    var duration = instantMode ? 0 : 520;
    stages.forEach(function(stageName, index){
      var delay = duration * index;
      var timerId = setTimeout(function(){
        setStage(stageName);
        applyStageSnapshot(stageName, data);
        var api = window.__agentx3d;
        if (api && typeof api.setProgress === 'function') {
          try { api.setProgress((index + 1) / stages.length); } catch (e) {}
        }
        if (index === stages.length - 1) {
          running = false;
          if (processBtn) processBtn.disabled = false;
          track('live_sale_demo_complete', {
            scenario: activeScenario,
            final_offer: data.oferta,
            next_action: data.accion
          });
        }
      }, delay);
      timerIds.push(timerId);
    });
  }

  choiceButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      activeScenario = btn.getAttribute('data-live-scenario') || 'clinic';
      var selected = scenarioCatalog[activeScenario];
      if (input && selected) input.value = selected.input;
      inputIsCustom = false;
      choiceButtons.forEach(function(choice){
        var isSelected = choice === btn;
        choice.classList.toggle('selected', isSelected);
        choice.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
      setField('status', 'Escenario cargado. Presiona "Procesar lead".');
    });
  });

  if (input) {
    input.addEventListener('input', function(){
      inputIsCustom = true;
      activeScenario = 'custom';
      choiceButtons.forEach(function(choice){
        choice.classList.remove('selected');
        choice.setAttribute('aria-pressed', 'false');
      });
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    runDemo();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function(){
      resetDemo('Demo reiniciada. Lista para replay.');
      setStage('signal');
      var api = window.__agentx3d;
      if (api && typeof api.setScene === 'function') {
        try { api.setScene('hero'); } catch (e) {}
      }
      if (api && typeof api.setProgress === 'function') {
        try { api.setProgress(0); } catch (e) {}
      }
      track('live_sale_demo_reset', { scenario: activeScenario });
    });
  }

  document.addEventListener('visibilitychange', function(){
    if (!document.hidden || !running) return;
    clearTimers();
    running = false;
    if (processBtn) processBtn.disabled = false;
    setField('status', 'Demo pausada al cambiar de pestaña. Puedes retomarla con "Procesar lead".');
  });

  if (!input || !input.value.trim()) {
    input.value = scenarioCatalog[activeScenario].input;
  }
  choiceButtons.forEach(function(choice){
    var isSelected = choice.getAttribute('data-live-scenario') === activeScenario;
    choice.classList.toggle('selected', isSelected);
    choice.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
  resetDemo('Listo para ejecutar demo.');
})();
