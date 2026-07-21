(() => {
  'use strict';

  const root = document.documentElement;
  const banner = document.querySelector('#demo-banner');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  const languageButtons = [...document.querySelectorAll('[data-lang]')];
  const programButtons = [...document.querySelectorAll('[data-program]')];
  const dialog = document.querySelector('#concept-dialog');
  let language = 'en';

  const programCopy = {
    metabolic: {
      en: {
        label: 'Proposed program 01',
        title: 'Metabolic health',
        copy: 'A future conversation could look at goals, history, daily patterns, and appropriate next steps before any treatment is discussed.',
        action: 'See what this demo means'
      },
      es: {
        label: 'Programa propuesto 01',
        title: 'Salud metabólica',
        copy: 'Una conversación futura podría revisar objetivos, antecedentes, hábitos cotidianos y siguientes pasos adecuados antes de hablar de cualquier tratamiento.',
        action: 'Ver qué significa esta demostración'
      }
    },
    longevity: {
      en: {
        label: 'Proposed program 02',
        title: 'Peptides & longevity',
        copy: 'A careful future program would begin with evidence, uncertainty, alternatives, and individual risk, never with a protocol chosen from a catalog.',
        action: 'See what this demo means'
      },
      es: {
        label: 'Programa propuesto 02',
        title: 'Péptidos y longevidad',
        copy: 'Un programa futuro responsable comenzaría con evidencia, incertidumbre, alternativas y riesgo individual; nunca con un protocolo elegido de un catálogo.',
        action: 'Ver qué significa esta demostración'
      }
    },
    recovery: {
      en: {
        label: 'Proposed program 03',
        title: 'Recovery & performance',
        copy: 'A future review could connect sleep, training, pain, stress, nutrition, and appropriate referrals rather than reducing recovery to one score.',
        action: 'See what this demo means'
      },
      es: {
        label: 'Programa propuesto 03',
        title: 'Recuperación y rendimiento',
        copy: 'Una evaluación futura podría relacionar sueño, entrenamiento, dolor, estrés, nutrición y referencias adecuadas, sin reducir la recuperación a una sola cifra.',
        action: 'Ver qué significa esta demostración'
      }
    },
    mens: {
      en: {
        label: 'Proposed program 04',
        title: "Men's health",
        copy: 'A private place to discuss energy, sexual health, sleep, mood, and preventive needs without assuming a diagnosis or predetermined treatment.',
        action: 'See what this demo means'
      },
      es: {
        label: 'Programa propuesto 04',
        title: 'Salud masculina',
        copy: 'Un espacio privado para hablar de energía, salud sexual, sueño, estado de ánimo y prevención, sin suponer un diagnóstico ni un tratamiento predeterminado.',
        action: 'Ver qué significa esta demostración'
      }
    },
    womens: {
      en: {
        label: 'Proposed program 05',
        title: "Women's health",
        copy: 'A future experience could make room for changing needs across life stages while distinguishing online support from care that requires an in-person exam.',
        action: 'See what this demo means'
      },
      es: {
        label: 'Programa propuesto 05',
        title: 'Salud femenina',
        copy: 'Una experiencia futura podría atender necesidades que cambian en distintas etapas de vida y distinguir el apoyo en línea de la atención que requiere una consulta presencial.',
        action: 'Ver qué significa esta demostración'
      }
    },
    hair: {
      en: {
        label: 'Proposed program 06',
        title: 'Hair & skin',
        copy: 'A future conversation would consider history, possible causes, expectations, and when dermatology or in-person evaluation is the better route.',
        action: 'See what this demo means'
      },
      es: {
        label: 'Programa propuesto 06',
        title: 'Cabello y piel',
        copy: 'Una conversación futura consideraría antecedentes, posibles causas, expectativas y cuándo la dermatología o una evaluación presencial es la mejor opción.',
        action: 'Ver qué significa esta demostración'
      }
    }
  };

  const setBannerHeight = () => {
    if (!banner) return;
    root.style.setProperty('--banner-h', `${Math.ceil(banner.getBoundingClientRect().height)}px`);
  };

  const setProgram = (name) => {
    const copy = programCopy[name]?.[language];
    if (!copy) return;

    programButtons.forEach((button) => {
      const active = button.dataset.program === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    document.querySelector('#program-detail-label').textContent = copy.label;
    document.querySelector('#program-detail-title').textContent = copy.title;
    document.querySelector('#program-detail-copy').textContent = copy.copy;
    const action = document.querySelector('#program-detail-action');
    action.replaceChildren(document.createTextNode(`${copy.action} `));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    action.append(arrow);
  };

  const setLanguage = (nextLanguage) => {
    language = nextLanguage === 'es' ? 'es' : 'en';
    root.lang = language;

    document.querySelectorAll('[data-en][data-es]').forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.querySelectorAll('[data-alt-en][data-alt-es]').forEach((image) => {
      image.alt = image.dataset[`alt${language === 'en' ? 'En' : 'Es'}`];
    });
    document.querySelectorAll('[data-aria-en][data-aria-es]').forEach((element) => {
      element.setAttribute('aria-label', element.dataset[`aria${language === 'en' ? 'En' : 'Es'}`]);
    });
    languageButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === language));
    });

    document.title = language === 'es'
      ? 'Mereon — Un concepto de salud de ByAgentX'
      : 'Mereon — A ByAgentX healthspan concept';

    const currentProgram = programButtons.find((button) => button.classList.contains('is-active'))?.dataset.program || 'metabolic';
    setProgram(currentProgram);
    setBannerHeight();
  };

  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', language === 'es'
      ? (open ? 'Cerrar navegación' : 'Abrir navegación')
      : (open ? 'Close navigation' : 'Open navigation'));
    nav?.classList.toggle('is-open', open);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  programButtons.forEach((button) => {
    button.addEventListener('click', () => setProgram(button.dataset.program));
  });

  document.querySelectorAll('[data-demo-open]').forEach((button) => {
    button.addEventListener('click', () => {
      if (typeof dialog?.showModal === 'function') dialog.showModal();
    });
  });

  document.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => dialog?.close());
  });

  dialog?.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((element) => observer.observe(element));
  }

  if ('ResizeObserver' in window && banner) {
    new ResizeObserver(setBannerHeight).observe(banner);
  } else {
    window.addEventListener('resize', setBannerHeight, { passive: true });
  }

  setBannerHeight();
  setProgram('metabolic');
})();
