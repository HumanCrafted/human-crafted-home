// STL viewer — drag to spin a 3D model on a project page.
//
// Authored in Obsidian as ![[file.stl]]; _plugins/obsidian_links.rb turns that
// into <div class="stl-viewer" data-src="..."> and loads this module. Models
// live in assets/models/.
//
// three.js is ~170KB gzipped, so it is imported only after a viewer scrolls
// into view — pages without a model never pay for it.
//
// Colors are read from the CSS design tokens at build time and re-read when the
// theme toggle flips [data-theme], so the model always matches the page.

const THREE_URL = new URL('./lib/three.module.min.js', import.meta.url).href;

// The model is normalized to a bounding sphere of radius 1 and centered on the
// origin, so every constant below is model-independent — an STL in millimeters
// and one in inches frame identically.
const FOV    = 35;     // vertical, degrees
const MARGIN = 1.18;   // breathing room around the model at the default framing
const SPIN   = 0.25;   // idle auto-rotate, radians/sec
const ZOOM   = [0.55, 1.8];             // multiples of the fitted distance
const POLAR  = [0.05, Math.PI - 0.05];  // clamp so the model never flips over

// Idle spin direction, as seen from above. Set per embed with ![[m.stl|spin=cw]].
// The camera orbits rather than the model turning, so the signs are inverted:
// walking the camera one way makes the model appear to turn the other.
const SPIN_DIRS = { ccw: -1, cw: 1, off: 0, none: 0 };
const SPIN_DEFAULT = 'ccw';

// Which of the model's own axes points up, set per embed with ![[m.stl|up=+z]].
// three.js is Y-up, so +y is the default (no correction); CAD tools like Fusion
// export Z-up, which arrives on its side until told up=+z. Each value maps to the
// mesh rotation [x, y, z] that carries that model axis onto world +Y — the axis
// the camera orbits, so it's also what the idle spin turns around.
const HALF_PI = Math.PI / 2;
const UP_ROTATIONS = {
  '+y': [0, 0, 0],          // native — no correction
  '-y': [Math.PI, 0, 0],
  '+z': [-HALF_PI, 0, 0],   // Z-up (Fusion 360 & most CAD)
  '-z': [HALF_PI, 0, 0],
  '+x': [0, 0, HALF_PI],
  '-x': [0, 0, -HALF_PI],
};
const UP_DEFAULT = '+y';

// Normalize an up value: trim, lowercase, allow a bare axis ("z" -> "+z").
function parseUp(raw) {
  let up = (raw || UP_DEFAULT).trim().toLowerCase();
  if (/^[xyz]$/.test(up)) up = '+' + up;
  if (!UP_ROTATIONS[up]) {
    if (raw) console.warn(`[stl-viewer] unknown up="${raw}", using ${UP_DEFAULT}`);
    up = UP_DEFAULT;
  }
  return up;
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function token(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// Parse binary or ASCII STL into a three.js BufferGeometry.
//
// Binary layout: 80-byte header, uint32 triangle count, then 50 bytes per
// triangle (3 floats normal + 9 floats vertices + 2 bytes attribute). Some
// exporters write an ASCII "solid" header on binary files, so detect by size
// rather than by the magic word.
function parseSTL(buffer, THREE) {
  const view = new DataView(buffer);
  const isBinary = buffer.byteLength >= 84 &&
    84 + view.getUint32(80, true) * 50 === buffer.byteLength;

  const geometry = new THREE.BufferGeometry();

  if (isBinary) {
    const count = view.getUint32(80, true);
    const positions = new Float32Array(count * 9);
    const normals   = new Float32Array(count * 9);

    for (let i = 0; i < count; i++) {
      const tri = 84 + i * 50;
      const nx = view.getFloat32(tri, true);
      const ny = view.getFloat32(tri + 4, true);
      const nz = view.getFloat32(tri + 8, true);

      for (let v = 0; v < 3; v++) {
        const p = tri + 12 + v * 12;
        const o = i * 9 + v * 3;
        positions[o]     = view.getFloat32(p, true);
        positions[o + 1] = view.getFloat32(p + 4, true);
        positions[o + 2] = view.getFloat32(p + 8, true);
        normals[o]     = nx;
        normals[o + 1] = ny;
        normals[o + 2] = nz;
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal',   new THREE.BufferAttribute(normals, 3));
  } else {
    const text = new TextDecoder().decode(buffer);
    const positions = [];
    const re = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      positions.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
  }

  return geometry;
}

async function mount(el, THREE) {
  const src = el.dataset.src;
  el.textContent = '';

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  el.appendChild(renderer.domElement);

  // A quiet "drag to rotate" affordance (Lucide rotate-3d), tucked in the corner
  // in place of a text caption. Injected here rather than from the plugin so the
  // inline SVG never passes through kramdown, and so it only shows when the
  // viewer is actually interactive. aria-hidden — the label lives on el.
  const hint = document.createElement('div');
  hint.className = 'stl-viewer-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2"/>' +
    '<path d="m15.194 13.707 3.814 1.86-1.86 3.814"/>' +
    '<path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4"/>' +
    '</svg>';
  el.appendChild(hint);

  // Key light plus a soft sky/ground fill — enough to read the form's curvature
  // without looking like a product render.
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 3, 2);
  scene.add(key);
  scene.add(new THREE.DirectionalLight(0xffffff, 0.5).translateX(-3));

  const hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 1.1);
  scene.add(hemi);

  // A floor of light so no face ever bottoms out at pure black. The model is
  // floating, not resting on anything — its underside should read as turned
  // away from the light, not as sitting in a shadow.
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const material = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.0 });

  // Re-read tokens so the model tracks the light/dark toggle.
  //
  // The model floats on --background, so it needs a tone that separates from the
  // paper in each theme: --surface reads as pale concrete on light paper, while
  // dark uses the warm grey of --muted-foreground, which stays legible against
  // dark paper and still has room to shade downward under the key light.
  function applyTheme() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    material.color.set(token(dark ? '--muted-foreground' : '--surface', dark ? '#948F87' : '#ECE3CE'));
    // Sky fill is what keeps the side facing away from the key light from
    // sinking into the paper — it has to be brighter than the model's own tone.
    hemi.color.set(token(dark ? '--foreground' : '--background', '#FAF7F2'));
    // groundColor paints every downward-facing surface. It must NOT be the page
    // background: that reads as a shadow cast onto a floor the scene doesn't
    // have. A mid tone keeps the underside legible as just an unlit face.
    hemi.groundColor.set(token('--muted', dark ? '#736356' : '#948F87'));
    hemi.intensity   = dark ? 1.5 : 1.1;
    key.intensity    = dark ? 2.0 : 2.2;
    ambient.color.set(token(dark ? '--foreground' : '--background', '#FAF7F2'));
    ambient.intensity = dark ? 0.5 : 0.35;
    render();
  }

  const response = await fetch(src);
  if (!response.ok) throw new Error(`${response.status} fetching ${src}`);
  const geometry = parseSTL(await response.arrayBuffer(), THREE);

  // Center the model on the origin and normalize it to a unit bounding sphere,
  // so any STL frames the same way regardless of its authored units.
  geometry.computeBoundingBox();
  const center = geometry.boundingBox.getCenter(new THREE.Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.computeBoundingSphere();
  const scale = 1 / geometry.boundingSphere.radius;
  geometry.scale(scale, scale, scale);

  // Orient the model so the requested axis points up. Rotation is about the
  // origin, and the bounding sphere is rotation-invariant, so framing is
  // unaffected. cord-keeper.stl is authored Y-up, so its default needs nothing.
  const [rx, ry, rz] = UP_ROTATIONS[parseUp(el.dataset.up)];
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(rx, ry, rz);
  const pivot = new THREE.Object3D();
  pivot.add(mesh);
  scene.add(pivot);

  // --- Orbit state. Hand-rolled rather than pulling in OrbitControls: this is
  // drag-to-spin and pinch/wheel-to-zoom only, no pan, no inertia surprises.
  //
  // `zoom` is a multiple of `fitted`, the distance at which the unit bounding
  // sphere exactly fills the frame. Because that sphere encloses the model at
  // every orientation, the model can never clip against the frame edge no
  // matter how it is spun — and a narrow phone viewport just pushes the camera
  // back rather than cropping.
  let azimuth = 0.6, polar = Math.PI / 2.6, zoom = 1, fitted = 4;

  const spinDir = SPIN_DIRS[(el.dataset.spin || SPIN_DEFAULT).toLowerCase()] ?? SPIN_DIRS[SPIN_DEFAULT];
  let autoSpin = spinDir !== 0 && !reducedMotion.matches;
  let dirty = true;

  function place() {
    const d = fitted * zoom;
    camera.position.set(
      d * Math.sin(polar) * Math.sin(azimuth),
      d * Math.cos(polar),
      d * Math.sin(polar) * Math.cos(azimuth),
    );
    camera.lookAt(0, 0, 0);
  }

  function render() { dirty = true; }

  function resize() {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    // Let three.js set the canvas CSS size too — with updateStyle off, the
    // canvas lays out at its device-pixel buffer size and gets cropped.
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Fit against whichever axis is tighter — vertical on a wide frame,
    // horizontal on a narrow one.
    const vFov = (FOV * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    fitted = MARGIN / Math.sin(Math.min(vFov, hFov) / 2);

    place();
    render();
  }

  // --- Pointer handling
  let pointers = new Map();
  let lastPinch = 0;

  el.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    el.setPointerCapture(e.pointerId);
    autoSpin = false;
    el.classList.add('is-grabbing');
  });

  el.addEventListener('pointermove', (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      azimuth -= dx * 0.008;
      polar = Math.min(POLAR[1], Math.max(POLAR[0], polar - dy * 0.008));
      place();
      render();
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const spread = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastPinch) {
        zoom = Math.min(ZOOM[1], Math.max(ZOOM[0], zoom * (lastPinch / spread)));
        place();
        render();
      }
      lastPinch = spread;
    }
  });

  function release(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastPinch = 0;
    if (pointers.size === 0) el.classList.remove('is-grabbing');
  }
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);

  // Zoom only on an intentional pinch — a trackpad pinch arrives as a wheel
  // event with ctrlKey set. A plain scroll passes through, so the page never
  // gets stuck when the cursor happens to be over the viewer.
  el.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    autoSpin = false;
    zoom = Math.min(ZOOM[1], Math.max(ZOOM[0], zoom * (1 + Math.sign(e.deltaY) * 0.1)));
    place();
    render();
  }, { passive: false });

  // Keyboard parity for the drag interaction.
  el.addEventListener('keydown', (e) => {
    const step = 0.15;
    if (e.key === 'ArrowLeft')       azimuth += step;
    else if (e.key === 'ArrowRight') azimuth -= step;
    else if (e.key === 'ArrowUp')    polar = Math.max(POLAR[0], polar - step);
    else if (e.key === 'ArrowDown')  polar = Math.min(POLAR[1], polar + step);
    else return;
    e.preventDefault();
    autoSpin = false;
    place();
    render();
  });

  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme'],
  });
  reducedMotion.addEventListener('change', (e) => { if (e.matches) autoSpin = false; });

  new ResizeObserver(resize).observe(el);
  resize();  // also does the initial place()

  // Only run the loop while the viewer is on screen, and only redraw when
  // something actually changed — an idle viewer costs nothing.
  let running = false, last = 0;
  function frame(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    if (autoSpin) { azimuth += SPIN * spinDir * dt; place(); dirty = true; }
    if (dirty) { renderer.render(scene, camera); dirty = false; }
    requestAnimationFrame(frame);
  }

  new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible && !running) { running = true; last = 0; requestAnimationFrame(frame); }
    else if (!visible) { running = false; }
  }, { rootMargin: '100px' }).observe(el);

  el.classList.add('is-ready');
}

// Defer both the three.js download and setup until a viewer nears the viewport.
document.querySelectorAll('.stl-viewer[data-src]').forEach((el) => {
  el.tabIndex = 0;
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', el.dataset.label || '3D model — drag to rotate');

  const load = new IntersectionObserver(async (entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    try {
      const THREE = await import(THREE_URL);
      await mount(el, THREE);
    } catch (err) {
      console.error('[stl-viewer]', err);
      el.classList.add('is-error');
      el.textContent = 'Could not load the 3D model.';
    }
  }, { rootMargin: '300px' });

  load.observe(el);
});
