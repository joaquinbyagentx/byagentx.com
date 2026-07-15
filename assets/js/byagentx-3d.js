import * as THREE from '../vendor/three/three.module.min.js';

const VERSION = '20260715-motion3d-v3';
const PIPELINE_LABELS = ['Website', 'WhatsApp', 'CRM', 'Payments', 'Human handoff'];
let activeController = null;

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

function createSeededRandom(seed = 481516) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function disposeScene(scene) {
  scene.traverse((object) => {
    if (object.geometry && typeof object.geometry.dispose === 'function') object.geometry.dispose();
    if (!object.material) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      Object.keys(material).forEach((key) => {
        const value = material[key];
        if (value && value.isTexture && typeof value.dispose === 'function') value.dispose();
      });
      if (typeof material.dispose === 'function') material.dispose();
    });
  });
}

export function mountAgentX3D(options = {}) {
  if (activeController && !activeController.destroyed) return activeController.api;

  const canvas = options.canvas || document.getElementById('agentx3d');
  if (!canvas) throw new Error('AgentX 3D canvas not found');

  const finePointer = window.matchMedia?.('(pointer:fine)').matches ?? false;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0.12, 8.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const root = new THREE.Group();
  const sculpture = new THREE.Group();
  const pipeline = new THREE.Group();
  root.add(sculpture, pipeline);
  scene.add(root);

  const jade = new THREE.Color(0x62e6b2);
  const blue = new THREE.Color(0x75a7ff);
  const gold = new THREE.Color(0xf2bd79);

  const hemisphere = new THREE.HemisphereLight(0xbfe4ff, 0x071018, 1.05);
  scene.add(hemisphere);

  const keyLight = new THREE.PointLight(0x62e6b2, 34, 18, 1.8);
  keyLight.position.set(-3.8, 3.4, 4.8);
  scene.add(keyLight);

  const intelligenceLight = new THREE.PointLight(0x75a7ff, 28, 18, 1.8);
  intelligenceLight.position.set(4.1, 1.4, 3.7);
  scene.add(intelligenceLight);

  const handoffLight = new THREE.PointLight(0xf2bd79, 13, 15, 1.8);
  handoffLight.position.set(1.8, -3.1, 4.2);
  scene.add(handoffLight);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x08131c,
    metalness: 0.56,
    roughness: 0.16,
    transmission: 0.3,
    thickness: 1.3,
    transparent: true,
    opacity: 0.82,
    emissive: 0x123b30,
    emissiveIntensity: 0.52,
    clearcoat: 1,
    clearcoatRoughness: 0.09,
    ior: 1.68,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.13, 5), coreMaterial);
  sculpture.add(core);

  const intelligenceCore = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.72, 0.17, 192, 24, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0x2b6a58,
      emissive: 0x2a9a76,
      emissiveIntensity: 0.7,
      metalness: 0.72,
      roughness: 0.2,
      clearcoat: 1,
      transparent: true,
      opacity: 0.74,
    }),
  );
  intelligenceCore.scale.setScalar(0.72);
  sculpture.add(intelligenceCore);

  const wireShell = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.32, 2),
    new THREE.MeshBasicMaterial({
      color: 0xa9d8ca,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sculpture.add(wireShell);

  const ringDefinitions = [
    { radius: 1.72, tube: 0.012, color: jade, rotation: [1.16, 0.16, 0.35] },
    { radius: 2.08, tube: 0.009, color: blue, rotation: [0.22, 1.18, -0.24] },
    { radius: 1.48, tube: 0.008, color: gold, rotation: [1.46, 0.72, 0.18] },
  ];
  const rings = ringDefinitions.map((definition) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(definition.radius, definition.tube, 10, 192),
      new THREE.MeshBasicMaterial({
        color: definition.color,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ring.rotation.set(...definition.rotation);
    sculpture.add(ring);
    return ring;
  });

  const random = createSeededRandom();
  const pointCount = 420;
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  for (let index = 0; index < pointCount; index += 1) {
    const radius = 1.7 + random() * 1.45;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[index * 3 + 2] = radius * Math.cos(phi);
    const color = index % 7 === 0 ? gold : (index % 2 === 0 ? jade : blue);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dataField = new THREE.Points(
    pointGeometry,
    new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sculpture.add(dataField);

  const pathPoints = [
    new THREE.Vector3(-3.1, -1.58, -0.2),
    new THREE.Vector3(-1.55, -1.04, 0.42),
    new THREE.Vector3(0, -1.46, 0.76),
    new THREE.Vector3(1.55, -1.02, 0.42),
    new THREE.Vector3(3.1, -1.58, -0.2),
  ];
  const routeCurve = new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.22);
  const routeTube = new THREE.Mesh(
    new THREE.TubeGeometry(routeCurve, 160, 0.018, 8, false),
    new THREE.MeshBasicMaterial({
      color: 0x91c8ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  pipeline.add(routeTube);

  const nodeGeometries = [
    new THREE.BoxGeometry(0.26, 0.2, 0.11, 2, 2, 1),
    new THREE.IcosahedronGeometry(0.17, 2),
    new THREE.CylinderGeometry(0.16, 0.16, 0.24, 24, 2),
    new THREE.TorusGeometry(0.16, 0.055, 12, 32),
    new THREE.OctahedronGeometry(0.2, 2),
  ];
  const nodeColors = [jade, jade, blue, blue, gold];
  const nodes = pathPoints.map((position, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: nodeColors[index],
      emissive: nodeColors[index],
      emissiveIntensity: 0.42,
      metalness: 0.62,
      roughness: 0.24,
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(nodeGeometries[index], material);
    mesh.position.copy(position);
    pipeline.add(mesh);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.29, 0.007, 8, 48),
      new THREE.MeshBasicMaterial({
        color: nodeColors[index],
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    halo.position.copy(position);
    halo.rotation.x = Math.PI / 2;
    pipeline.add(halo);
    return { mesh, halo };
  });

  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 20, 12),
    new THREE.MeshBasicMaterial({
      color: 0xe5fff5,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  pipeline.add(pulse);

  const sceneProfiles = {
    hero: { cameraZ: 8.05, rootX: 1.05, rootY: 0.08, rootScale: 1, rotation: 0.42, glow: 1, activeNode: 0 },
    offer: { cameraZ: 7.6, rootX: 1.72, rootY: -0.02, rootScale: 1.08, rotation: 0.78, glow: 1.05, activeNode: 1 },
    system: { cameraZ: 7.15, rootX: -1.5, rootY: 0.06, rootScale: 1.15, rotation: 1.2, glow: 1.15, activeNode: 2 },
    proof: { cameraZ: 7.65, rootX: 1.65, rootY: -0.04, rootScale: 1.03, rotation: 1.58, glow: 1.02, activeNode: 4 },
    pricing: { cameraZ: 8.35, rootX: 0.1, rootY: 0.25, rootScale: 0.92, rotation: 1.88, glow: 0.86, activeNode: 3 },
    close: { cameraZ: 7.25, rootX: 0, rootY: 0.05, rootScale: 1.2, rotation: 2.28, glow: 1.22, activeNode: 4 },
  };

  const state = {
    status: 'ready',
    currentScene: 'hero',
    progress: 0,
    activeNode: 0,
    paused: false,
    rendering: false,
    quality: finePointer ? 'high' : 'balanced',
    frames: 0,
  };
  const pointerTarget = { x: 0, y: 0 };
  const scaleTarget = new THREE.Vector3(1, 1, 1);
  const pulsePosition = new THREE.Vector3();
  let destroyed = false;
  let rafId = 0;
  let lastFrameAt = 0;
  let currentDpr = 0;

  function setScene(sceneId) {
    if (!sceneProfiles[sceneId]) return;
    state.currentScene = sceneId;
    state.activeNode = sceneProfiles[sceneId].activeNode;
  }

  function setProgress(progress) {
    state.progress = clamp01(progress);
  }

  function setQuality(quality) {
    state.quality = quality === 'low' ? 'low' : (quality === 'balanced' ? 'balanced' : 'high');
    resize();
  }

  function pause() {
    state.paused = true;
    state.rendering = false;
  }

  function resume() {
    if (destroyed) return;
    state.paused = false;
  }

  function targetDpr() {
    const cap = state.quality === 'low' ? 1 : (state.quality === 'balanced' ? 1.25 : 1.5);
    return Math.min(window.devicePixelRatio || 1, cap);
  }

  function resize() {
    if (destroyed) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width || window.innerWidth));
    const height = Math.max(1, Math.round(rect.height || window.innerHeight));
    const dpr = targetDpr();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (currentDpr !== dpr) {
      currentDpr = dpr;
      renderer.setPixelRatio(dpr);
    }
    renderer.setSize(width, height, false);
  }

  function onPointerMove(event) {
    pointerTarget.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
    pointerTarget.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
  }

  function onVisibilityChange() {
    if (document.hidden) pause();
    else resume();
  }

  function renderFrame(time) {
    if (destroyed) return;
    rafId = window.requestAnimationFrame(renderFrame);
    if (state.paused || document.hidden) return;

    const targetFps = state.quality === 'low' ? 28 : (state.quality === 'balanced' ? 36 : 45);
    const frameInterval = 1000 / targetFps;
    if (time - lastFrameAt < frameInterval) return;
    lastFrameAt = time;

    const seconds = time * 0.001;
    const profile = sceneProfiles[state.currentScene] || sceneProfiles.hero;
    const scrollInfluence = state.progress - 0.5;

    root.position.x += (profile.rootX + pointerTarget.x * 0.08 - root.position.x) * 0.04;
    root.position.y += (profile.rootY - pointerTarget.y * 0.06 + scrollInfluence * 0.16 - root.position.y) * 0.04;
    scaleTarget.setScalar(profile.rootScale);
    root.scale.lerp(scaleTarget, 0.04);
    root.rotation.y += (profile.rotation + pointerTarget.x * 0.11 + scrollInfluence * 0.18 - root.rotation.y) * 0.035;
    root.rotation.x += (-pointerTarget.y * 0.07 + scrollInfluence * 0.1 - root.rotation.x) * 0.035;

    camera.position.z += (profile.cameraZ - camera.position.z) * 0.04;
    camera.position.x += (pointerTarget.x * 0.12 - camera.position.x) * 0.035;
    camera.position.y += (0.12 - pointerTarget.y * 0.08 - camera.position.y) * 0.035;

    core.rotation.x = seconds * 0.075;
    core.rotation.y = seconds * 0.14;
    intelligenceCore.rotation.x = -seconds * 0.19;
    intelligenceCore.rotation.y = seconds * 0.24;
    wireShell.rotation.x = -seconds * 0.052;
    wireShell.rotation.y = -seconds * 0.1;
    rings[0].rotation.z = seconds * 0.13;
    rings[1].rotation.x = 0.22 + seconds * 0.07;
    rings[2].rotation.y = 0.72 - seconds * 0.09;
    dataField.rotation.y = -seconds * 0.025;
    pipeline.rotation.y = Math.sin(seconds * 0.24) * 0.035;

    const pulseProgress = (seconds * 0.12 + state.progress * 0.23) % 1;
    routeCurve.getPointAt(pulseProgress, pulsePosition);
    pulse.position.copy(pulsePosition);
    pulse.scale.setScalar(0.84 + Math.sin(seconds * 4.2) * 0.18);

    nodes.forEach((node, index) => {
      const active = index === state.activeNode;
      const targetScale = active ? 1.42 + Math.sin(seconds * 2.8) * 0.08 : 0.92;
      node.mesh.scale.x += (targetScale - node.mesh.scale.x) * 0.08;
      node.mesh.scale.y += (targetScale - node.mesh.scale.y) * 0.08;
      node.mesh.scale.z += (targetScale - node.mesh.scale.z) * 0.08;
      node.mesh.rotation.y += 0.008 + index * 0.001;
      node.mesh.material.emissiveIntensity += ((active ? 1.25 : 0.34) - node.mesh.material.emissiveIntensity) * 0.08;
      node.halo.rotation.z = seconds * (index % 2 ? -0.24 : 0.2);
      node.halo.material.opacity += ((active ? 0.82 : 0.13) - node.halo.material.opacity) * 0.08;
      node.halo.scale.setScalar(active ? 1.2 + Math.sin(seconds * 3) * 0.08 : 1);
    });

    keyLight.intensity = (31 + Math.sin(seconds * 1.1) * 2.4) * profile.glow;
    intelligenceLight.intensity = 26 * profile.glow;
    handoffLight.intensity = (state.activeNode === 4 ? 20 : 11) * profile.glow;
    coreMaterial.emissiveIntensity = 0.45 + profile.glow * 0.12;

    renderer.render(scene, camera);
    state.frames += 1;
    state.rendering = true;
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    state.status = 'destroyed';
    state.rendering = false;
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    if (finePointer) window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    disposeScene(scene);
    renderer.renderLists.dispose();
    renderer.dispose();
    if (typeof renderer.forceContextLoss === 'function') renderer.forceContextLoss();
    canvas.width = 1;
    canvas.height = 1;
    // A context explicitly lost with WEBGL_lose_context cannot be reused
    // reliably. Replace only the inert canvas so a later policy change can
    // remount the cached module without retaining the old GPU context.
    if (canvas.isConnected) canvas.replaceWith(canvas.cloneNode(false));
    document.documentElement.classList.remove('real-3d-ready');
    if (activeController?.api === api) activeController = null;
  }

  const api = {
    version: VERSION,
    three: THREE.REVISION,
    status: 'ready',
    realGeometry: true,
    sceneReady: true,
    siteWide: true,
    narrativeApi: true,
    geometries: ['IcosahedronGeometry', 'TorusKnotGeometry', 'DodecahedronGeometry', 'TubeGeometry', 'BoxGeometry', 'CylinderGeometry', 'TorusGeometry', 'OctahedronGeometry'],
    pipelineNodes: PIPELINE_LABELS.slice(),
    setScene,
    setProgress,
    setQuality,
    pause,
    resume,
    destroy,
    get state() {
      return { ...state };
    },
  };

  activeController = {
    api,
    get destroyed() { return destroyed; },
  };
  window.__agentx3d = api;
  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (finePointer) window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  document.documentElement.classList.add('real-3d-ready');
  document.documentElement.dataset.agentx3d = 'ready';
  rafId = window.requestAnimationFrame(renderFrame);
  window.dispatchEvent(new CustomEvent('agentx:3d-ready', { detail: { version: VERSION, realGeometry: true } }));
  return api;
}

export const THREE_REVISION = THREE.REVISION;