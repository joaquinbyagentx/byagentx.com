import * as THREE from '../vendor/three/three.module.min.js';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const richMotion = window.matchMedia && window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches;
const saveData = !!(navigator.connection && navigator.connection.saveData);
const finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
const canvas = document.getElementById('agentx3d');
const hero = document.querySelector('.hero');

if (richMotion && !saveData && canvas && hero && gsap && ScrollTrigger) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.15, 7.2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const group = new THREE.Group();
  scene.add(group);

  const green = new THREE.Color('#62e6b2');
  const blue = new THREE.Color('#75a7ff');
  const blueSoft = new THREE.Color('#91c2ff');
  const gold = new THREE.Color('#f2bd79');

  scene.add(new THREE.AmbientLight(0xa8c9d8, 0.3));
  const key = new THREE.PointLight(0x62e6b2, 18, 18);
  key.position.set(-3.5, 2.8, 5.5);
  scene.add(key);
  const rim = new THREE.PointLight(0x75a7ff, 14, 14);
  rim.position.set(3.4, -1.7, 4.8);
  scene.add(rim);
  const intelligenceLight = new THREE.PointLight(0x91c2ff, 7, 13);
  intelligenceLight.position.set(1.8, 2.6, -2.2);
  scene.add(intelligenceLight);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.12, 4),
    new THREE.MeshPhysicalMaterial({
      color: 0x091019,
      metalness: 0.72,
      roughness: 0.18,
      transmission: 0.28,
      thickness: 1.1,
      transparent: true,
      opacity: 0.66,
      emissive: 0x12312a,
      emissiveIntensity: 0.42,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 1.72,
    })
  );
  group.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.17, 2),
    new THREE.MeshBasicMaterial({ color: 0xb6d8d0, wireframe: true, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending })
  );
  group.add(wire);

  const torusMat = new THREE.MeshBasicMaterial({ color: 0x62e6b2, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending });
  const torusA = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.012, 10, 160), torusMat);
  torusA.rotation.x = Math.PI / 2.4;
  group.add(torusA);
  const torusB = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.01, 10, 180), torusMat.clone());
  torusB.material.color = blue;
  torusB.rotation.y = Math.PI / 2.8;
  group.add(torusB);
  const torusC = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.008, 10, 140), torusMat.clone());
  torusC.material.color = blueSoft;
  torusC.rotation.set(Math.PI / 2.1, Math.PI / 3, 0);
  group.add(torusC);

  const pointCount = 520;
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  for (let i = 0; i < pointCount; i++) {
    const r = 1.55 + Math.random() * 1.25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions.set([x, y, z], i * 3);
    const c = i % 3 === 0 ? green : (i % 3 === 1 ? blue : blueSoft);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(pointGeo, new THREE.PointsMaterial({ size: 0.026, vertexColors: true, transparent: true, opacity: 0.86, blending: THREE.AdditiveBlending, depthWrite: false }));
  group.add(points);

  const pipeline = new THREE.Group();
  scene.add(pipeline);
  const nodeMat = (color) => new THREE.MeshStandardMaterial({ color, metalness: 0.62, roughness: 0.22, emissive: color, emissiveIntensity: 0.28, transparent: true, opacity: 0.92 });
  const nodePositions = [
    new THREE.Vector3(-2.8, -1.85, 0),
    new THREE.Vector3(-0.92, -1.15, 0.45),
    new THREE.Vector3(0.92, -1.15, 0.45),
    new THREE.Vector3(2.8, -1.85, 0),
  ];
  const nodeColors = [green, blue, blueSoft, gold];
  const nodes = nodePositions.map((pos, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 16), nodeMat(nodeColors[i]));
    m.position.copy(pos);
    m.scale.setScalar(0.72);
    pipeline.add(m);
    return m;
  });
  const curvePoints = [];
  for (let i = 0; i < nodePositions.length - 1; i++) {
    const a = nodePositions[i], b = nodePositions[i + 1];
    for (let j = 0; j < 28; j++) {
      const t = j / 27;
      const p = new THREE.Vector3().lerpVectors(a, b, t);
      p.y += Math.sin(t * Math.PI) * 0.24;
      p.z += Math.sin(t * Math.PI) * 0.24;
      curvePoints.push(p);
    }
  }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x9cc8ff, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending }));
  pipeline.add(line);
  pipeline.position.y = -0.14;
  pipeline.scale.setScalar(0.9);

  const target = { x: 0, y: 0, scroll: 0 };
  const sceneState = { id: 'hero', progress: 0, paused: false, quality: 'high' };
  const pipelineScaleTarget = new THREE.Vector3();
  let lastFrameAt = 0;
  const sceneProfiles = {
    hero: { z: 7.05, groupY: 0, pipelineY: -0.14, pipelineScale: 0.9, rot: 1.0, glow: 1.0 },
    offer: { z: 6.55, groupY: -0.05, pipelineY: 0.02, pipelineScale: 0.98, rot: 1.15, glow: 1.05 },
    system: { z: 6.1, groupY: 0.08, pipelineY: 0.22, pipelineScale: 1.15, rot: 1.35, glow: 1.16 },
    demo: { z: 5.85, groupY: 0.03, pipelineY: 0.34, pipelineScale: 1.25, rot: 1.55, glow: 1.22 },
    comparison: { z: 6.35, groupY: -0.02, pipelineY: 0.18, pipelineScale: 1.05, rot: 1.25, glow: 1.06 },
    proof: { z: 6.85, groupY: -0.08, pipelineY: 0.06, pipelineScale: 0.98, rot: 1.05, glow: 0.98 },
    pricing: { z: 6.25, groupY: 0.05, pipelineY: 0.28, pipelineScale: 1.12, rot: 1.42, glow: 1.18 },
    close: { z: 5.95, groupY: 0.1, pipelineY: 0.36, pipelineScale: 1.22, rot: 1.55, glow: 1.26 },
  };
  function clamp01(v) { return Math.max(0, Math.min(1, Number(v) || 0)); }
  function setScene(id) { if (sceneProfiles[id]) sceneState.id = id; }
  function setProgress(progress) { sceneState.progress = clamp01(progress); }
  function setQuality(quality) { sceneState.quality = quality || sceneState.quality; }
  function pause() { sceneState.paused = true; }
  function resume() { sceneState.paused = false; }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width || innerWidth);
    const h = Math.max(1, r.height || innerHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  if (finePointer) {
    addEventListener('pointermove', (e) => {
      target.x = (e.clientX / innerWidth - 0.5) * 2;
      target.y = (e.clientY / innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty('--cursor-x', `${(e.clientX / innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--cursor-y', `${(e.clientY / innerHeight) * 100}%`);
    }, { passive: true });
  }

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => { target.scroll = self.progress; },
  });
  gsap.fromTo(nodes.map(n => n.scale), { x: 0.2, y: 0.2, z: 0.2 }, {
    x: 1.08, y: 1.08, z: 1.08, stagger: 0.18, ease: 'power2.out',
    scrollTrigger: { trigger: '#como-opera', start: 'top 75%', end: 'bottom 45%', scrub: true }
  });
  gsap.fromTo(['.stage-card', '.pipeline-step', '.asset-node'], { y: 16, opacity: 1 }, {
    y: 0, opacity: 1, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '#como-opera', start: 'top 70%', end: '#casos top', scrub: 0.7 }
  });
  gsap.utils.toArray('.btn,.prompt-chip,.proof a,.price-card,.card').forEach((el) => {
    if (!finePointer) return;
    el.classList.add('magnetic');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.16;
      const y = (e.clientY - r.top - r.height / 2) * 0.16;
      gsap.to(el, { x, y, duration: 0.32, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.52, ease: 'elastic.out(1, .35)' }));
  });

  function animate(time) {
    requestAnimationFrame(animate);
    if (sceneState.paused || document.hidden) return;
    const targetFps = (!finePointer || sceneState.quality === 'low') ? 30 : 40;
    const frameInterval = 1000 / targetFps;
    if (time - lastFrameAt < frameInterval) return;
    lastFrameAt = time;
    const t = time * 0.001;
    const scroll = Math.max(target.scroll, sceneState.progress * 0.72);
    const profile = sceneProfiles[sceneState.id] || sceneProfiles.hero;
    group.rotation.y += (target.x * 0.25 + scroll * profile.rot + t * 0.08 - group.rotation.y) * 0.035;
    group.rotation.x += (-target.y * 0.16 + scroll * 0.42 - group.rotation.x) * 0.035;
    group.rotation.z = Math.sin(t * 0.35) * 0.04;
    group.position.y += (profile.groupY - group.position.y) * 0.035;
    core.rotation.y = t * 0.18;
    core.rotation.x = t * 0.09;
    wire.rotation.y = -t * 0.12;
    torusA.rotation.z = t * 0.15;
    torusB.rotation.x = t * 0.12;
    torusC.rotation.y = -t * 0.16;
    points.rotation.y = -t * 0.035;
    pipeline.rotation.y += (target.x * 0.08 - pipeline.rotation.y) * 0.04;
    pipeline.position.y += (profile.pipelineY + scroll * 0.18 - pipeline.position.y) * 0.04;
    pipelineScaleTarget.setScalar(profile.pipelineScale);
    pipeline.scale.lerp(pipelineScaleTarget, 0.035);
    camera.position.z += ((finePointer ? profile.z : profile.z + 0.75) - scroll * 0.62 - camera.position.z) * 0.035;
    camera.position.x += (target.x * 0.22 - camera.position.x) * 0.035;
    camera.position.y += (-target.y * 0.14 + 0.15 - camera.position.y) * 0.035;
    key.intensity = (16 + Math.sin(t * 1.2) * 2) * profile.glow;
    rim.intensity = 13 * profile.glow;
    intelligenceLight.intensity = 6.5 * profile.glow;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  document.documentElement.classList.add('real-3d-ready');
  window.__agentx3d = {
    three: THREE.REVISION,
    gsap: gsap.version,
    scrollTrigger: !!ScrollTrigger,
    nodes: nodes.length,
    realGeometry: true,
    narrativeApi: true,
    setScene,
    setProgress,
    setQuality,
    pause,
    resume,
    get state() { return { ...sceneState }; },
  };
}
