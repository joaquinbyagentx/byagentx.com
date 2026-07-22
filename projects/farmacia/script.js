(() => {
  'use strict';

  const catalog = [
    { id: 'brio-metabolic', name: 'Brío Metabólico', category: 'metabolic', goals: ['metabolic'], price: 129, styles: ['guided', 'integral'], reason: 'Aporta una estructura más completa y seguimiento semanal ilustrativo.' },
    { id: 'metabolic-essentials', name: 'Base Metabólica', category: 'metabolic', goals: ['metabolic'], price: 89, styles: ['simple', 'guided'], reason: 'Concentra lo esencial en una rutina clara y fácil de comenzar.' },
    { id: 'longevity-compass', name: 'Brújula Longevidad', category: 'longevity', goals: ['longevity'], price: 149, styles: ['guided', 'integral'], reason: 'Organiza contenido educativo y preguntas para una conversación profesional.' },
    { id: 'cellular-rhythm', name: 'Ritmo Vital', category: 'longevity', goals: ['longevity', 'wellness'], price: 99, styles: ['simple', 'guided'], reason: 'Convierte sueño, energía y constancia en una rutina mensual sencilla.' },
    { id: 'recovery-reset', name: 'Recovery Reset', category: 'recovery', goals: ['recovery'], price: 79, styles: ['guided'], reason: 'Equilibra movilidad guiada y planificación sin añadir complejidad.' },
    { id: 'mobility-daily', name: 'Movilidad Diaria', category: 'recovery', goals: ['recovery', 'wellness'], price: 45, styles: ['simple'], reason: 'Es una entrada accesible con rutinas breves para sostener cada día.' },
    { id: 'mens-balance', name: 'Balance Hombre', category: 'mens', goals: ['mens', 'wellness'], price: 89, styles: ['guided'], reason: 'Ordena temas de bienestar masculino con una navegación discreta.' },
    { id: 'womens-rhythm', name: 'Ritmo Mujer', category: 'womens', goals: ['womens', 'wellness'], price: 99, styles: ['guided'], reason: 'Agrupa prioridades y contenido de bienestar por etapa de vida.' },
    { id: 'hair-skin-ritual', name: 'Ritual Cabello + Piel', category: 'hair', goals: ['hair', 'wellness'], price: 59, styles: ['simple'], reason: 'Propone una rutina cotidiana visual, concreta y de bajo esfuerzo.' },
    { id: 'daily-foundation', name: 'Base Diaria', category: 'wellness', goals: ['wellness', 'metabolic'], price: 39, styles: ['simple'], reason: 'Ofrece la entrada de menor precio con planificación semanal práctica.' },
    { id: 'sleep-calm', name: 'Sueño + Calma', category: 'wellness', goals: ['wellness', 'longevity'], price: 49, styles: ['simple'], reason: 'Se enfoca en un cierre del día consistente y fácil de repetir.' },
    { id: 'performance-club', name: 'Performance Club', category: 'recovery', goals: ['recovery'], price: 119, styles: ['flexible', 'integral'], reason: 'Da más variedad y acompañamiento a una rutina de rendimiento.' }
  ];

  const goalLabels = {
    metabolic: 'Bienestar metabólico',
    longevity: 'Péptidos y longevidad',
    recovery: 'Recuperación y rendimiento',
    mens: 'Salud masculina',
    womens: 'Salud femenina',
    hair: 'Cabello y piel',
    wellness: 'Bienestar diario'
  };

  const styleLabels = {
    simple: 'Una rutina sencilla',
    guided: 'Más acompañamiento',
    flexible: 'Comparar y tener variedad',
    integral: 'Una experiencia integral'
  };

  const budgetLabels = {
    low: 'Hasta $60 al mes',
    mid: 'Hasta $120 al mes',
    high: 'Sin tope definido'
  };

  const state = { step: 'goal', goal: null, style: null, budget: null, locked: false };
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  const banner = document.querySelector('#demo-banner');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const productCards = [...document.querySelectorAll('.product-card')];
  const catalogStatus = document.querySelector('#catalog-status');
  const agent = document.querySelector('#sales-agent');
  const overlay = document.querySelector('[data-agent-overlay]');
  const agentLog = document.querySelector('#agent-log');
  const quickReplies = document.querySelector('#agent-quick');
  const agentInput = document.querySelector('#agent-input');
  const agentSend = document.querySelector('#agent-send');
  let returnFocus = null;

  const normalize = (value) => value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9$@.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const emergencyPattern = /\b(emergencia|urgencia|crisis suicida|suicid\w*|matarme|me voy a matar|quiero morir|no quiero vivir|quitar(?:me)? la vida|acabar con mi vida|terminar con mi vida|hacerme dano|quiero hacerme dano|me quiero hacer dano|lastimarme|autolesion\w*|no puedo respirar|dificultad para respirar|me falta el aire|me ahogo|dolor (en el )?pecho|infarto|ataque (al )?corazon|ataque cardiaco|paro cardiaco|derrame( cerebral)?|ictus|no siento un lado|se me cayo un lado de la cara|cara caida|no puedo hablar|debilidad de un lado|sobredosis|overdose|todas las pastillas|pastillas de mas|demasiad[oa]s? (?:pastillas|medicamentos|medicinas)|(?:me )?(?:tome|trague|ingeri|bebi|consumi) (?:(?:demasiad[oa]s?|much[oa]s?|varios|varias) )?(?:pastillas|medicamentos|medicinas|cloro|lejia|veneno|quimicos?)|intoxicacion|intoxicad[oa]|me intoxique|envenenamiento|envenenad[oa]|me envenene|anafilaxia|sangrado abundante|me desmay\w*|convulsion\w*|inconsciente)\b/i;
  const medicalPattern = /\b(diagnostico|diagnosticaron|enfermedad|condicion medica|sintoma|migran\w*|diabetes|cancer|asma|embaraz\w*|alerg\w*|presion arterial|colesterol|lesion|dolor|medicamento|medicacion|medicina|receta|dosis|protocolo medico|tratamiento|elegible|contraindicacion|efecto secundario|debo (usar|tomar)|deberia (usar|tomar))\b/i;
  const contactPattern = /(?:\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b)|(?:\+?\d[\d\s().-]{7,}\d)/i;
  const identityPattern = /(?:\b(me llamo|mi nombre|vivo en|mi direccion|direccion es|calle|avenida|codigo postal|telegram|whatsapp|instagram|facebook|tiktok)\b)|@\w+/i;
  const poisoningStatePattern = /\b(sobredosis|overdose|intoxic\w*|envenen\w*)\b/i;
  const ingestionVerbPattern = /\b(tom\w*|inger\w*|ingir\w*|trag\w*|beb\w*|consum\w*|com(?:i|er|io|e|emos|en|iendo|ido)\w*)\b/i;
  const toxicSubstancePattern = /\b(cloro|lejia|lavandin\w*|venen\w*|toxic\w*|corrosiv\w*|caustic\w*|sosa|acido\w*|sustancias? (?:toxic\w*|venenos\w*|peligros\w*)|productos? (?:quimic\w*|de limpieza)|liquidos? de limpieza|quimic\w*|detergent\w*|amoniac\w*|limpiador\w*|desengrasante\w*|pesticid\w*|insecticid\w*|herbicid\w*|fungicid\w*|raticid\w*|rodenticid\w*|anticongelante\w*|solvente\w*|disolvente\w*|aguarras|gasolina|combustible|desinfectante\w*|metanol|alcohol (?:isopropilico|de quemar)|acetona|quitaesmalte\w*|cianuro|arsenico|mercurio|jabon\w*|champu\w*)\b/i;
  const medicationObjectPattern = /\b(pastill\w*|medicament\w*|medicin\w*|capsul\w*|remedi\w*|farmac\w*|dosis|jarabe\w*|gotas|ampolla\w*)\b/i;
  const overdoseContainerPattern = /\b(?:(?:un|una|el|la) )?(?:frasco|bote|botella|caja|paquete|blister)(?: entero| entera| completo| completa)?\b/i;
  const overdoseSignalPattern = /\b(\d{2,4}|once|doce|trece|catorce|quince|dieciseis|diecisiete|dieciocho|diecinueve|veinte|treinta|cuarenta|cincuenta|cien|docena\w*|demasiad\w*|much\w*|tod\w*|varios?|varias?|mas|exceso|extra|doble|triple|de golpe|de mas)\b/i;
  const safeVocabulary = {
    goal: new Set('quiero busco me interesa priorizo necesito explorar ver conocer mejorar apoyar bajar aumentar sentirme mejor enfocarme opciones opcion algo para de del en el la los las con y mi una un sobre bienestar metabolico metabolismo peso alimentacion nutricion habitos longevidad peptidos edad envejecer energia recuperacion recuperarme recuperar rendimiento ejercicio entrenamiento movilidad deporte hombre masculina varon mujer femenina ciclo cabello pelo piel sueno estres calma diario diaria rutina'.split(' ')),
    style: new Set('quiero busco prefiero me interesa una un algo mas con de y facil sencilla sencillo simple basica basico rapida rapido guiada guiado acompanamiento seguimiento ayuda comparar variedad flexible opciones opcion integral'.split(' ')),
    budget: new Set('hasta menos mas de presupuesto mensual bajo baja medio media intermedio intermedia alto alta economico economica barato barata sin tope definido premium completo completa'.split(' '))
  };

  const isAllowedStepText = (text, step) => {
    const words = text.match(/[a-z0-9$]+/g) || [];
    if (!words.length || words.length > 14 || !safeVocabulary[step]) return false;
    return words.every((word) => safeVocabulary[step].has(word) || /^\$?\d{1,4}$/.test(word));
  };

  const isEmergencyText = (text) => {
    if (emergencyPattern.test(text) || poisoningStatePattern.test(text)) return true;
    if (!ingestionVerbPattern.test(text)) return false;
    if (toxicSubstancePattern.test(text)) return true;
    if (overdoseContainerPattern.test(text)) return true;
    return medicationObjectPattern.test(text) && overdoseSignalPattern.test(text);
  };

  const setBannerHeight = () => {
    if (banner) document.documentElement.style.setProperty('--banner-height', `${Math.ceil(banner.getBoundingClientRect().height)}px`);
  };

  const addMessage = (text, type = 'bot') => {
    const message = document.createElement('div');
    message.className = `agent-message${type === 'bot' ? '' : ` agent-message--${type}`}`;
    message.textContent = text;
    agentLog.append(message);
    agentLog.scrollTop = agentLog.scrollHeight;
    return message;
  };

  const setQuickReplies = (choices) => {
    quickReplies.replaceChildren();
    choices.forEach(({ label, value }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.dataset.choice = value;
      button.addEventListener('click', () => {
        handleChoice(value, label);
        focusCurrentStep();
      });
      quickReplies.append(button);
    });
  };

  const focusCurrentStep = () => requestAnimationFrame(() => {
    if (agent.hidden) return;
    const target = state.step === 'results'
      ? agentLog.querySelector('.agent-result button')
      : quickReplies.querySelector('button');
    (target || agentInput)?.focus();
  });

  const goalChoices = () => Object.entries(goalLabels).map(([value, label]) => ({ value, label }));
  const styleChoices = () => [
    { value: 'simple', label: styleLabels.simple },
    { value: 'guided', label: styleLabels.guided },
    { value: 'flexible', label: styleLabels.flexible }
  ];
  const budgetChoices = () => Object.entries(budgetLabels).map(([value, label]) => ({ value, label }));

  const askGoal = () => {
    state.step = 'goal';
    addMessage('¿Qué te gustaría priorizar en tu rutina de bienestar?');
    setQuickReplies(goalChoices());
  };

  const askStyle = () => {
    state.step = 'style';
    addMessage('Perfecto. ¿Qué tipo de experiencia prefieres?');
    setQuickReplies(styleChoices());
  };

  const askBudget = () => {
    state.step = 'budget';
    addMessage('Última pregunta: ¿qué presupuesto mensual ilustrativo quieres explorar?');
    setQuickReplies(budgetChoices());
  };

  const resetAgent = ({ announce = true } = {}) => {
    Object.assign(state, { step: 'goal', goal: null, style: null, budget: null, locked: false });
    agentLog.replaceChildren();
    quickReplies.replaceChildren();
    agentInput.value = '';
    agentInput.disabled = false;
    agentSend.disabled = false;
    if (announce) {
      addMessage('Hola. Soy el asesor demo de Mereon. Te ayudaré a comparar el catálogo con tres preguntas no sensibles.');
      askGoal();
    }
  };

  const budgetMax = (budget) => ({ low: 60, mid: 120, high: Number.POSITIVE_INFINITY }[budget]);

  const getRecommendations = () => {
    const max = budgetMax(state.budget);
    const withinBudget = catalog.filter((item) => item.price <= max);
    let candidates = withinBudget.filter((item) => item.goals.includes(state.goal));
    if (!candidates.length) candidates = withinBudget.filter((item) => item.category === 'wellness');
    if (!candidates.length) candidates = catalog.filter((item) => item.goals.includes(state.goal));

    return candidates
      .map((item) => ({
        ...item,
        score: (item.goals[0] === state.goal ? 5 : 2) + (item.styles.includes(state.style) ? 4 : 0) - (item.price > max ? 3 : 0)
      }))
      .sort((a, b) => b.score - a.score || a.price - b.price)
      .slice(0, 3);
  };

  const showRecommendations = () => {
    state.step = 'results';
    const recommendations = getRecommendations();
    addMessage(`Estas son ${recommendations.length === 1 ? 'la opción que mejor coincide' : 'las opciones que mejor coinciden'} con ${goalLabels[state.goal].toLocaleLowerCase('es')}, ${styleLabels[state.style].toLocaleLowerCase('es')} y tu rango demo.`);

    const results = document.createElement('div');
    results.className = 'agent-results';
    recommendations.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'agent-result';

      const label = document.createElement('small');
      label.textContent = index === 0 ? 'Mejor coincidencia' : 'También considera';
      const name = document.createElement('strong');
      name.textContent = item.name;
      const price = document.createElement('span');
      price.className = 'agent-result__price';
      price.textContent = `$${item.price}/mes`;
      const reason = document.createElement('p');
      reason.textContent = item.reason;
      const action = document.createElement('button');
      action.type = 'button';
      action.textContent = 'Ver opción recomendada';
      action.addEventListener('click', () => visitProduct(item.id));
      card.append(label, name, price, reason, action);
      results.append(card);
    });
    agentLog.append(results);
    agentLog.scrollTop = agentLog.scrollHeight;
    setQuickReplies([
      { value: 'browse', label: 'Explorar catálogo' },
      { value: 'restart', label: 'Empezar de nuevo' }
    ]);
  };

  const handleChoice = (value, label) => {
    if (state.locked) return;
    if (value === 'browse') {
      closeAgent();
      document.querySelector('#catalogo')?.scrollIntoView({ block: 'start' });
      return;
    }
    if (value === 'restart') {
      resetAgent();
      return;
    }

    addMessage(label, 'user');
    if (state.step === 'goal' && goalLabels[value]) {
      state.goal = value;
      askStyle();
    } else if (state.step === 'style' && styleLabels[value]) {
      state.style = value;
      askBudget();
    } else if (state.step === 'budget' && budgetLabels[value]) {
      state.budget = value;
      showRecommendations();
    }
  };

  const parseGoal = (text) => {
    const rules = [
      ['metabolic', /(metabol|\bpeso\b|aliment|nutric|habito)/],
      ['longevity', /(longevid|peptid|\bedad\b|envej|energia)/],
      ['recovery', /(recuper|rendimiento|ejercicio|entren|movilidad|deporte)/],
      ['mens', /(\bhombre\b|masculin|varon)/],
      ['womens', /(\bmujer\b|femenin|\bciclo\b)/],
      ['hair', /\b(cabello|pelo|piel|skin|hair)\b/],
      ['wellness', /\b(bienestar|sueno|estres|calma|diario|diaria|rutina)\b/]
    ];
    return rules.find(([, pattern]) => pattern.test(text))?.[0] || null;
  };

  const parseStyle = (text) => {
    if (/(\bsimple\b|sencill|facil|basico|rapido)/.test(text)) return 'simple';
    if (/(guiad|acompan|seguimiento|\bayuda\b)/.test(text)) return 'guided';
    if (/(compar|variedad|flexible|opciones|integral)/.test(text)) return 'flexible';
    return null;
  };

  const parseBudget = (text) => {
    const amountMatch = text.match(/\d{1,4}/);
    if (amountMatch) {
      const amount = Number(amountMatch[0]) + (/\bmas de\b/.test(text) ? 1 : 0);
      return amount <= 60 ? 'low' : amount <= 120 ? 'mid' : 'high';
    }
    if (/\b(barat|econom|bajo|menos|hasta)\b/.test(text)) return 'low';
    if (/\b(medio|intermedio)\b/.test(text)) return 'mid';
    if (/\b(alto|premium|completo|mas de|más de)\b/.test(text)) return 'high';
    return null;
  };

  const stopForEmergency = () => {
    state.locked = true;
    state.step = 'emergency';
    quickReplies.replaceChildren();
    agentInput.value = '';
    agentInput.disabled = true;
    agentSend.disabled = true;
    const message = addMessage('Parece que podrías necesitar ayuda inmediata. Voy a detener la orientación comercial. Contacta ahora a los servicios de emergencia de tu localidad o acude al centro de urgencias más cercano. Si estás en peligro inmediato, no esperes una respuesta en línea.', 'emergency');
    message.setAttribute('role', 'alert');
    message.tabIndex = -1;
    message.focus();
  };

  const handleText = () => {
    const raw = agentInput.value.trim();
    if (!raw || state.locked) return;
    agentInput.value = '';
    const text = normalize(raw);

    if (isEmergencyText(text)) {
      stopForEmergency();
      return;
    }
    if (contactPattern.test(raw) || identityPattern.test(text)) {
      addMessage('No puedo aceptar datos de contacto. No guardaré ni repetiré lo escrito. Responde solo con una opción general de los botones.', 'boundary');
      return;
    }
    if (medicalPattern.test(text) || medicationObjectPattern.test(text)) {
      addMessage('Esa pregunta requiere a un profesional autorizado. Yo no evalúo diagnósticos, elegibilidad, medicamentos, dosis ni tratamientos. Puedo seguir ayudándote únicamente a navegar categorías y programas demo.', 'boundary');
      return;
    }

    if (state.step === 'results') {
      addMessage('Ya preparé tus coincidencias. Puedes visitar una opción, explorar el catálogo o reiniciar para cambiar criterios.');
      return;
    }

    if (!isAllowedStepText(text, state.step)) {
      addMessage('Solo puedo procesar frases generales sobre objetivo, preferencia o presupuesto. No usaré ni repetiré otros datos; elige uno de los botones para continuar.', 'boundary');
      return;
    }

    const parsed = state.step === 'goal' ? parseGoal(text) : state.step === 'style' ? parseStyle(text) : parseBudget(text);
    if (!parsed) {
      addMessage('No estoy seguro de cómo clasificar esa respuesta y no repetiré el texto. Elige una opción general para mantener la recomendación clara y no compartas datos personales o médicos.');
      return;
    }

    const label = state.step === 'goal' ? goalLabels[parsed] : state.step === 'style' ? styleLabels[parsed] : budgetLabels[parsed];
    handleChoice(parsed, label);
    focusCurrentStep();
  };

  const openAgent = (trigger) => {
    returnFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    resetAgent({ announce: false });
    agent.hidden = false;
    overlay.hidden = false;
    document.body.classList.add('agent-open');

    const presetGoal = trigger?.dataset.goal;
    const productName = trigger?.dataset.productName;
    addMessage('Hola. Soy el asesor demo de Mereon. Comparo opciones sin pedir datos personales o médicos.');
    if (presetGoal && goalLabels[presetGoal]) {
      state.goal = presetGoal;
      addMessage(productName ? `Veo que estás explorando ${productName}. Usaré ${goalLabels[presetGoal].toLocaleLowerCase('es')} como punto de partida.` : `Empecemos por ${goalLabels[presetGoal].toLocaleLowerCase('es')}.`);
      askStyle();
    } else {
      askGoal();
    }
    requestAnimationFrame(() => agent.querySelector('[data-agent-close]')?.focus());
  };

  const closeAgent = () => {
    agent.hidden = true;
    overlay.hidden = true;
    document.body.classList.remove('agent-open');
    resetAgent({ announce: false });
    if (returnFocus instanceof HTMLElement && document.contains(returnFocus)) returnFocus.focus();
  };

  const visitProduct = (id) => {
    const card = document.querySelector(`#product-${CSS.escape(id)}`);
    closeAgent();
    filters.find((filter) => filter.dataset.filter === 'all')?.click();
    productCards.forEach((item) => item.classList.remove('is-recommended'));
    card?.classList.add('is-recommended');
    card?.scrollIntoView({ block: 'center' });
    if (card) {
      card.tabIndex = -1;
      requestAnimationFrame(() => card.focus({ preventScroll: true }));
    }
    window.setTimeout(() => card?.classList.remove('is-recommended'), 5000);
  };

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const selected = filter.dataset.filter;
      let count = 0;
      filters.forEach((item) => {
        const active = item === filter;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      productCards.forEach((card) => {
        const visible = selected === 'all' || card.dataset.category === selected;
        card.hidden = !visible;
        if (visible) count += 1;
      });
      catalogStatus.textContent = `${count} ${count === 1 ? 'opción demo' : 'opciones demo'}`;
    });
  });

  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
    nav?.classList.toggle('is-open', open);
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Abrir navegación');
  }));

  document.querySelectorAll('[data-agent-open]').forEach((button) => button.addEventListener('click', () => openAgent(button)));
  document.querySelector('[data-agent-close]')?.addEventListener('click', closeAgent);
  document.querySelector('[data-agent-reset]')?.addEventListener('click', () => {
    resetAgent();
    focusCurrentStep();
  });
  overlay?.addEventListener('click', closeAgent);
  agentSend?.addEventListener('click', handleText);
  agentInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleText();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (agent.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAgent();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...agent.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!agent.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if ('ResizeObserver' in window && banner) new ResizeObserver(setBannerHeight).observe(banner);
  else window.addEventListener('resize', setBannerHeight, { passive: true });
  setBannerHeight();
})();
