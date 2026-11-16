"use client";

import { useEffect, useRef } from "react";

// Liquid-gold trail that follows the mouse: a small WebGL fluid simulation
// (advection → vorticity → pressure solve) shaded like polished metal.
// Desktop mouse only, off for reduced motion, and the render loop sleeps
// as soon as the gold has faded, so an idle page costs nothing.

const SIM_RES = 128; // velocity grid (short side)
const DYE_RES = 512; // colour grid (short side)
const PRESSURE_ITERATIONS = 20;
const CURL = 16;
const VELOCITY_DISSIPATION = 0.6;
const DYE_DISSIPATION = 1.9;
const SPLAT_RADIUS = 0.0014;
const SPLAT_FORCE = 3200;
const SPLAT_DYE = 0.2;
const IDLE_MS = 4500;

const VERT = `#version 300 es
in vec2 aPos;
uniform vec2 texel;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texel.x, 0.0);
  vR = vUv + vec2(texel.x, 0.0);
  vT = vUv + vec2(0.0, texel.y);
  vB = vUv - vec2(0.0, texel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 o;
`;

const FRAG = {
  splat: `${HEAD}
uniform sampler2D uTarget;
uniform float aspect, radius;
uniform vec3 color;
uniform vec2 point;
void main() {
  vec2 p = vUv - point;
  p.x *= aspect;
  o = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0);
}`,
  advect: `${HEAD}
uniform sampler2D uVelocity, uSource;
uniform vec2 velTexel;
uniform float dt, dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * velTexel;
  o = vec4(texture(uSource, coord).xyz / (1.0 + dissipation * dt), 1.0);
}`,
  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}
uniform sampler2D uVelocity, uCurl;
uniform float curl, dt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x, B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 0.0001;
  f *= curl * C;
  f.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + f * dt;
  o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `${HEAD}
uniform sampler2D uPressure, uDivergence;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4((L + R + B + T - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}
uniform sampler2D uPressure, uVelocity;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`,
  fade: `${HEAD}
uniform sampler2D uTexture;
uniform float value;
void main() { o = value * texture(uTexture, vUv); }`,
  // Treat the dye amount as a height map, light it like brushed gold.
  display: `${HEAD}
uniform sampler2D uTexture;
void main() {
  float d = texture(uTexture, vUv).r;
  float l = texture(uTexture, vL).r, r = texture(uTexture, vR).r;
  float t = texture(uTexture, vT).r, b = texture(uTexture, vB).r;
  vec3 n = normalize(vec3((l - r) * 16.0, (b - t) * 16.0, 1.0));
  vec3 lightDir = normalize(vec3(-0.45, 0.6, 0.65));
  float diff = max(dot(n, lightDir), 0.0);
  float spec = pow(max(dot(n, normalize(lightDir + vec3(0.0, 0.0, 1.0))), 0.0), 48.0);
  float rim = pow(1.0 - n.z, 1.6);
  vec3 bronze = vec3(0.30, 0.17, 0.03);
  vec3 gold = vec3(0.98, 0.70, 0.18);
  vec3 col = mix(bronze, gold, diff) + vec3(1.0, 0.86, 0.5) * rim * 0.55 + vec3(1.0, 0.96, 0.82) * spec * 1.3;
  float a = smoothstep(0.03, 0.4, d) * 0.85;
  o = vec4(col * a, a);
}`,
};

type Program = { prog: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type FBO = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number; tx: number; ty: number };
type DoubleFBO = { read: FBO; write: FBO; swap: () => void };

function startFluid(canvas: HTMLCanvasElement): (() => void) | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const programs = {} as Record<keyof typeof FRAG, Program>;
  for (const [name, src] of Object.entries(FRAG) as [keyof typeof FRAG, string][]) {
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, src));
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    const u: Program["u"] = {};
    const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(prog, i)!;
      u[info.name] = gl.getUniformLocation(prog, info.name);
    }
    programs[name] = { prog, u };
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const createFBO = (w: number, h: number): FBO => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h, tx: 1 / w, ty: 1 / h };
  };
  const createDouble = (w: number, h: number): DoubleFBO => {
    const d = { read: createFBO(w, h), write: createFBO(w, h), swap() { [d.read, d.write] = [d.write, d.read]; } };
    return d;
  };
  const freeFBO = (f: FBO) => {
    gl.deleteTexture(f.tex);
    gl.deleteFramebuffer(f.fbo);
  };

  const gridSize = (res: number) => {
    const aspect = window.innerWidth / window.innerHeight;
    return aspect >= 1 ? [Math.round(res * aspect), res] : [res, Math.round(res / aspect)];
  };

  let velocity: DoubleFBO, dye: DoubleFBO, pressure: DoubleFBO, divergence: FBO, curl: FBO;
  const allocate = () => {
    const [sw, sh] = gridSize(SIM_RES);
    const [dw, dh] = gridSize(DYE_RES);
    velocity = createDouble(sw, sh);
    pressure = createDouble(sw, sh);
    divergence = createFBO(sw, sh);
    curl = createFBO(sw, sh);
    dye = createDouble(dw, dh);
  };
  const release = () => {
    [velocity, pressure, dye].forEach((d) => d && (freeFBO(d.read), freeFBO(d.write)));
    [divergence, curl].forEach((f) => f && freeFBO(f));
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    release();
    allocate();
  };
  resize();

  const bindProgram = (p: Program, texel: [number, number]) => {
    gl.useProgram(p.prog);
    gl.uniform2f(p.u.texel, texel[0], texel[1]);
    return p.u;
  };
  let unit = 0;
  const bindTex = (loc: WebGLUniformLocation | null, f: FBO) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, f.tex);
    gl.uniform1i(loc, unit++);
  };
  const draw = (target: FBO | null) => {
    if (target) {
      gl.viewport(0, 0, target.w, target.h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    unit = 0;
  };

  const splat = (x: number, y: number, dx: number, dy: number, amount: number) => {
    const aspect = canvas.width / canvas.height;
    let u = bindProgram(programs.splat, [velocity.read.tx, velocity.read.ty]);
    bindTex(u.uTarget, velocity.read);
    gl.uniform1f(u.aspect, aspect);
    gl.uniform2f(u.point, x, y);
    gl.uniform3f(u.color, dx, dy, 0);
    gl.uniform1f(u.radius, SPLAT_RADIUS * (aspect > 1 ? aspect : 1));
    draw(velocity.write);
    velocity.swap();

    u = bindProgram(programs.splat, [dye.read.tx, dye.read.ty]);
    bindTex(u.uTarget, dye.read);
    gl.uniform1f(u.aspect, aspect);
    gl.uniform2f(u.point, x, y);
    gl.uniform3f(u.color, amount, 0, 0);
    gl.uniform1f(u.radius, SPLAT_RADIUS * (aspect > 1 ? aspect : 1));
    draw(dye.write);
    dye.swap();
  };

  const step = (dt: number) => {
    const vt: [number, number] = [velocity.read.tx, velocity.read.ty];

    let u = bindProgram(programs.curl, vt);
    bindTex(u.uVelocity, velocity.read);
    draw(curl);

    u = bindProgram(programs.vorticity, vt);
    bindTex(u.uVelocity, velocity.read);
    bindTex(u.uCurl, curl);
    gl.uniform1f(u.curl, CURL);
    gl.uniform1f(u.dt, dt);
    draw(velocity.write);
    velocity.swap();

    u = bindProgram(programs.divergence, vt);
    bindTex(u.uVelocity, velocity.read);
    draw(divergence);

    u = bindProgram(programs.fade, vt);
    bindTex(u.uTexture, pressure.read);
    gl.uniform1f(u.value, 0.8);
    draw(pressure.write);
    pressure.swap();

    u = bindProgram(programs.pressure, vt);
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      bindTex(u.uDivergence, divergence);
      bindTex(u.uPressure, pressure.read);
      draw(pressure.write);
      pressure.swap();
    }

    u = bindProgram(programs.gradient, vt);
    bindTex(u.uPressure, pressure.read);
    bindTex(u.uVelocity, velocity.read);
    draw(velocity.write);
    velocity.swap();

    u = bindProgram(programs.advect, vt);
    gl.uniform2f(u.velTexel, vt[0], vt[1]);
    gl.uniform1f(u.dt, dt);
    bindTex(u.uVelocity, velocity.read);
    bindTex(u.uSource, velocity.read);
    gl.uniform1f(u.dissipation, VELOCITY_DISSIPATION);
    draw(velocity.write);
    velocity.swap();

    u = bindProgram(programs.advect, [dye.read.tx, dye.read.ty]);
    gl.uniform2f(u.velTexel, vt[0], vt[1]);
    gl.uniform1f(u.dt, dt);
    bindTex(u.uVelocity, velocity.read);
    bindTex(u.uSource, dye.read);
    gl.uniform1f(u.dissipation, DYE_DISSIPATION);
    draw(dye.write);
    dye.swap();

    u = bindProgram(programs.display, [dye.read.tx, dye.read.ty]);
    bindTex(u.uTexture, dye.read);
    draw(null);
  };

  // Pointer state, read once per frame.
  let px = 0, py = 0, lastX = 0, lastY = 0, moved = false, hasPointer = false, burst = 0;
  let raf = 0, lastFrame = 0, lastInput = 0;

  const frame = (now: number) => {
    const dt = Math.min((now - lastFrame) / 1000, 1 / 60);
    lastFrame = now;
    if (moved) {
      const dx = (px - lastX) * SPLAT_FORCE;
      const dy = (py - lastY) * SPLAT_FORCE;
      splat(px, py, dx, dy, SPLAT_DYE + Math.min(Math.hypot(dx, dy) / 7000, 0.25));
      lastX = px;
      lastY = py;
      moved = false;
    }
    if (burst) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        splat(px, py, Math.cos(a) * 600, Math.sin(a) * 600, 0.22);
      }
      burst = 0;
    }
    step(dt);
    raf = now - lastInput < IDLE_MS ? requestAnimationFrame(frame) : 0;
  };
  const wake = () => {
    lastInput = performance.now();
    if (!raf && !document.hidden) {
      lastFrame = lastInput;
      raf = requestAnimationFrame(frame);
    }
  };

  const toUv = (e: PointerEvent) => [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    [px, py] = toUv(e);
    if (!hasPointer) {
      lastX = px;
      lastY = py;
      hasPointer = true;
    }
    moved = true;
    wake();
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    [px, py] = toUv(e);
    burst = 1;
    wake();
  };
  const onLeave = () => {
    hasPointer = false;
  };
  const onVisibility = () => {
    if (document.hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    cleanup();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("resize", resize);
  document.documentElement.addEventListener("pointerleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);

  function cleanup() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("resize", resize);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onLost);
  }

  return () => {
    cancelAnimationFrame(raf);
    cleanup();
    release();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

export function FluidCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    return startFluid(canvas) ?? undefined;
  }, []);

  return <canvas ref={ref} aria-hidden className="cursor-effect pointer-events-none fixed inset-0 z-40 h-full w-full" />;
}
