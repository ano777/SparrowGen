// The scratch card's cover: an orange "admit one" style ticket with a slowly moving, glittery texture.
//
// The texture is the "warp" Dithering shader from Paper Shaders (github.com/paper-design/shaders, Apache-2.0),
// cut down to the one look we use: orange #ef671c, peach #ffc691, random dithering, 0.5px grain, speed 0.4.
// The words (in the site's own fonts) are drawn once into an "ink" picture laid over the texture, and the
// scratched-off parts come from a "mask" picture: the shader leaves those pixels see-through.
//
// Smoothness: it draws at most 30 times a second, only while the card is on screen, and holds still while
// the page is scrolling. Without WebGL 2 it falls back to a still orange gradient.

const BACK = [0xef / 255, 0x67 / 255, 0x1c / 255];
const FRONT = [0xff / 255, 0xc6 / 255, 0x91 / 255];
const INK = "#5a3520";
const SPEED = 0.4;
const FPS = 30;
const GRAIN = 0.5;

const VERT = `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() { v_uv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_pxSize;
uniform vec3 u_colorBack;
uniform vec3 u_colorFront;
uniform sampler2D u_ink;
uniform sampler2D u_mask;
in vec2 v_uv;
out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

void main() {
  float t = 0.5 * u_time;
  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = (gl_FragCoord.xy - 0.5 * u_resolution) / pxSize;
  vec2 pix = (floor(pxSizeUV) + 0.5) * pxSize;

  // warp
  vec2 uv = (pix / u_pixelRatio + 0.5) * 0.003;
  for (float i = 1.0; i < 6.0; i++) {
    uv.x += 0.6 / i * cos(i * 2.5 * uv.y + t);
    uv.y += 0.6 / i * cos(i * 1.5 * uv.x + t);
  }
  float shape = 0.15 / max(0.001, abs(sin(t - uv.y - uv.x)));
  shape = smoothstep(0.02, 1.0, shape);

  // random dithering: the glitter
  float d = step(hash21(pix), shape) - 0.5;
  vec3 color = mix(u_colorBack, u_colorFront, step(0.5, shape + d));

  vec4 ink = texture(u_ink, v_uv); // premultiplied
  color = ink.rgb + color * (1.0 - ink.a);
  float m = texture(u_mask, v_uv).a;
  fragColor = vec4(color * m, m);
}`;

const font = (name: string, fallback: string) =>
  `${getComputedStyle(document.body).getPropertyValue(name).trim() || fallback}, ${fallback}`;

function track(ctx: CanvasRenderingContext2D, em: number, size: number) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${(em * size).toFixed(2)}px`;
}

/** Where the perforation sits (CSS px): a vertical line on wide cards, a horizontal one on phones. */
type Perf = { wide: boolean; at: number; notch: number };

// The ticket's words, laid out like the reference "admit one" ticket: two small labels, the big name,
// a footer line, and a stub with a pale watermark number and vertical text.
function drawInk(ctx: CanvasRenderingContext2D, w: number, h: number, touch: boolean): Perf {
  const disp = font("--font-display", "system-ui");
  const mono = font("--font-mono", "monospace");
  const labels = ["Sparrowgen presents", "3 things inside"].map((s) => s.toUpperCase());
  const name = ["SCRATCH", "ME"];
  const footer = (touch ? "Rub with your finger to scratch" : "Drag to scratch · No. 999").toUpperCase();
  const stub = "ONE PER VISITOR";
  const wide = w >= 560;

  ctx.clearRect(0, 0, w, h);
  ctx.textBaseline = "middle";

  const fitName = (maxW: number, maxH: number, size: number, lead: number) => {
    ctx.font = `800 ${size}px ${disp}`;
    track(ctx, -0.02, size);
    const longest = Math.max(...name.map((l) => ctx.measureText(l).width));
    return Math.max(0.05, Math.min(1, maxW / longest, maxH / (name.length * lead)));
  };
  const stubWords = (len: number, size: number) => {
    ctx.font = `600 ${size}px ${disp}`;
    track(ctx, 0, size);
    const s = Math.min(size, (size * len) / Math.max(1, ctx.measureText(stub).width));
    ctx.font = `600 ${s}px ${disp}`;
  };

  if (wide) {
    // proportions from the reference ticket (741 × 425)
    const u = Math.min(w / 741, h / 425);
    const perf = (562 / 741) * w, pad = (57 / 741) * w;
    const nameTop = (185 / 425) * h, footTop = (348 / 425) * h;

    ctx.strokeStyle = "rgba(90, 53, 32, 0.33)";
    ctx.lineWidth = Math.max(1, 0.0022 * w);
    ctx.setLineDash([0.012 * w, 0.012 * w]);
    ctx.beginPath(); ctx.moveTo(perf, 0); ctx.lineTo(perf, h); ctx.stroke();
    ctx.setLineDash([]);

    // stub: reads top to bottom
    ctx.save();
    ctx.translate(perf + (w - perf) / 2, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = "center";
    const wm = 144 * u;
    ctx.font = `800 ${wm}px ${disp}`;
    track(ctx, -0.04, wm);
    ctx.globalAlpha = 0.6; ctx.fillStyle = "#ffdcbe";
    ctx.fillText("999", 0, 0);
    stubWords(h * 0.84, 67.61 * u * 0.82);
    ctx.globalAlpha = 0.88; ctx.fillStyle = INK;
    ctx.fillText(stub, 0, 0);
    ctx.restore();

    ctx.fillStyle = INK;
    ctx.textAlign = "left";
    const ls = 19.72 * u, ll = 28 * u;
    ctx.font = `500 ${ls}px ${mono}`;
    track(ctx, 0.016, ls);
    labels.forEach((l, i) => ctx.fillText(l, pad, (58 / 425) * h + ll * (i + 0.5)));

    const ns = 64.79 * u, nl = 65 * u;
    const k = fitName(perf - pad - 0.03 * w, footTop - nameTop - 0.02 * w, ns, nl);
    ctx.font = `800 ${ns * k}px ${disp}`;
    track(ctx, -0.02, ns * k);
    name.forEach((l, i) => ctx.fillText(l, pad, nameTop + nl * k * (i + 0.5)));

    ctx.font = `500 ${ls}px ${mono}`;
    track(ctx, 0.016, ls);
    ctx.fillText(footer, pad, footTop + ls / 2);
    return { wide, at: perf, notch: (21 / 741) * w };
  }

  // phones: the same ticket turned upright, with the stub along the bottom
  const pad = 0.08 * w;
  const stubH = Math.round(Math.min(h * 0.26, w * 0.42));
  const perfY = h - stubH;

  ctx.strokeStyle = "rgba(90, 53, 32, 0.33)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([0.03 * w, 0.03 * w]);
  ctx.beginPath(); ctx.moveTo(0, perfY); ctx.lineTo(w, perfY); ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = "center";
  const wm = Math.min(stubH * 0.8, w * 0.4);
  ctx.font = `800 ${wm}px ${disp}`;
  track(ctx, -0.04, wm);
  ctx.globalAlpha = 0.6; ctx.fillStyle = "#ffdcbe";
  ctx.fillText("999", w / 2, perfY + stubH / 2);
  stubWords(w * 0.84, stubH * 0.3);
  ctx.globalAlpha = 0.88; ctx.fillStyle = INK;
  ctx.fillText(stub, w / 2, perfY + stubH / 2);
  ctx.globalAlpha = 1;

  ctx.textAlign = "left";
  const ls = Math.max(11, 0.04 * w), ll = ls * 1.42;
  ctx.font = `500 ${ls}px ${mono}`;
  track(ctx, 0.016, ls);
  labels.forEach((l, i) => ctx.fillText(l, pad, pad + ll * (i + 0.5)));
  const footY = perfY - pad * 0.8;
  ctx.fillText(footer, pad, footY);

  const top = pad + ll * 2 + pad * 0.6, bottom = footY - ls - pad * 0.6;
  const ns = 0.22 * w, nl = ns;
  const k = fitName(w - pad * 2, bottom - top, ns, nl);
  ctx.font = `800 ${ns * k}px ${disp}`;
  track(ctx, -0.02, ns * k);
  const y0 = top + (bottom - top - nl * k * name.length) / 2;
  name.forEach((l, i) => ctx.fillText(l, pad, y0 + nl * k * (i + 0.5)));
  return { wide, at: perfY, notch: 0.05 * w };
}

/** CSS mask that punches the two half-circle notches where the perforation meets the edges. */
export function notchMask({ wide, at, notch }: Perf) {
  const hole = (pos: string) => `radial-gradient(circle at ${pos}, transparent ${notch.toFixed(1)}px, #000 ${(notch + 0.6).toFixed(1)}px)`;
  return wide
    ? `${hole(`${at.toFixed(1)}px 0`)} top / 100% 50.5% no-repeat, ${hole(`${at.toFixed(1)}px 100%`)} bottom / 100% 50.5% no-repeat`
    : `${hole(`0 ${at.toFixed(1)}px`)} left / 50.5% 100% no-repeat, ${hole(`100% ${at.toFixed(1)}px`)} right / 50.5% 100% no-repeat`;
}

export class TicketCover {
  /** Scratch strokes are drawn here (CSS px) with "destination-out"; whatever is left is the cover. */
  readonly mask = document.createElement("canvas");
  readonly maskCtx = this.mask.getContext("2d", { willReadFrequently: true })!;
  private ink = document.createElement("canvas");
  private gl: WebGL2RenderingContext | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private tex: { ink: WebGLTexture; mask: WebGLTexture } | null = null;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private scale = 2;
  private w = 0;
  private h = 0;
  private time = 0;
  private lastDraw = 0;
  private raf = 0;
  private once = 0;
  private needDraw = false;
  private onScreen = false;
  private scrolling = false;
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;
  private maskDirty = true;
  private stopped = false;
  private io?: IntersectionObserver;
  private still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private touch = window.matchMedia("(pointer: coarse)").matches;

  constructor(private canvas: HTMLCanvasElement, private onFail: () => void) {
    this.gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });
    if (this.gl && !this.setupGl(this.gl)) { this.gl = null; onFail(); return; }
    if (!this.gl) this.ctx = canvas.getContext("2d");
    this.io = new IntersectionObserver(([e]) => { this.onScreen = e.isIntersecting; this.kick(); });
    this.io.observe(canvas);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    document.addEventListener("visibilitychange", this.kick);
  }

  private setupGl(gl: WebGL2RenderingContext) {
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn("Ticket shader:", gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    const p = gl.createProgram()!;
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn("Ticket shader:", gl.getProgramInfoLog(p)); return false; }
    gl.useProgram(p);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["u_time", "u_resolution", "u_pixelRatio", "u_pxSize", "u_colorBack", "u_colorFront", "u_ink", "u_mask"]) this.loc[n] = gl.getUniformLocation(p, n);
    gl.uniform1f(this.loc.u_pxSize, GRAIN);
    gl.uniform3fv(this.loc.u_colorBack, BACK);
    gl.uniform3fv(this.loc.u_colorFront, FRONT);
    gl.uniform1i(this.loc.u_ink, 0);
    gl.uniform1i(this.loc.u_mask, 1);
    const texture = (unit: number) => {
      const t = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    this.tex = { ink: texture(0), mask: texture(1) };
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    return true;
  }

  /** Size everything to the card, redraw the words, keep any scratches (stretched to the new size). Returns the notch layout. */
  layout(): Perf {
    const w = Math.max(1, this.canvas.clientWidth), h = Math.max(1, this.canvas.clientHeight);
    // 2× is enough for the grain to look the same on 3× phones (each grain dot is 1.5 screen pixels either way).
    this.scale = Math.min(2, Math.sqrt((1920 * 1080 * 2) / (w * h)));
    const W = Math.round(w * this.scale), H = Math.round(h * this.scale);
    this.canvas.width = W; this.canvas.height = H;

    if (this.w && (this.w !== w || this.h !== h)) {
      const old = document.createElement("canvas");
      old.width = this.mask.width; old.height = this.mask.height;
      old.getContext("2d")!.drawImage(this.mask, 0, 0);
      this.mask.width = w; this.mask.height = h;
      this.maskCtx.drawImage(old, 0, 0, w, h);
    } else if (!this.w) {
      this.mask.width = w; this.mask.height = h;
      this.maskCtx.fillStyle = "#000";
      this.maskCtx.fillRect(0, 0, w, h);
    }
    this.w = w; this.h = h;

    this.ink.width = W; this.ink.height = H;
    const ictx = this.ink.getContext("2d")!;
    ictx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    const perf = drawInk(ictx, w, h, this.touch);

    const gl = this.gl;
    if (gl && this.tex) {
      gl.viewport(0, 0, W, H);
      gl.uniform2f(this.loc.u_resolution, W, H);
      gl.uniform1f(this.loc.u_pixelRatio, this.scale);
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.ink);
    }
    this.maskDirty = true;
    this.draw();
    return perf;
  }

  /** Call after drawing a scratch stroke into the mask. */
  scratched() {
    this.maskDirty = true;
    this.needDraw = true;
    // the loop picks it up on its next frame; if it isn't running (scrolling, still mode), draw once
    if (!this.raf && !this.once) this.once = requestAnimationFrame(() => { this.once = 0; this.draw(); });
  }

  /** Share of the cover that has been scratched off (0..1). */
  cleared() {
    const { data } = this.maskCtx.getImageData(0, 0, this.mask.width, this.mask.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 4 * 40) { total++; if (data[i] < 40) clear++; }
    return total ? clear / total : 0;
  }

  private draw() {
    this.needDraw = false;
    const gl = this.gl;
    if (gl && this.tex) {
      if (this.maskDirty) {
        gl.activeTexture(gl.TEXTURE1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);
        this.maskDirty = false;
      }
      gl.uniform1f(this.loc.u_time, this.time * 1e-3);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return;
    }
    const c = this.ctx;
    if (!c) return;
    const W = this.canvas.width, H = this.canvas.height;
    c.globalCompositeOperation = "source-over";
    const g = c.createRadialGradient(W * 0.62, H * 0.3, 0, W * 0.62, H * 0.3, W * 0.58);
    g.addColorStop(0, "#ffc691"); g.addColorStop(0.45, "#fe9046"); g.addColorStop(1, "#ef671c");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    c.drawImage(this.ink, 0, 0);
    c.globalCompositeOperation = "destination-in";
    c.drawImage(this.mask, 0, 0, W, H);
    c.globalCompositeOperation = "source-over";
  }

  private onScroll = () => {
    if (!this.scrolling) { this.scrolling = true; this.kick(); }
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => { this.scrolling = false; this.kick(); }, 160);
  };

  /** Start or stop the animation loop to match what's on screen. */
  private kick = () => {
    const run = this.gl && !this.still && !this.stopped && this.onScreen && !this.scrolling && !document.hidden;
    if (run && !this.raf) { this.lastDraw = performance.now(); this.raf = requestAnimationFrame(this.loop); }
    if (!run && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  };

  private loop = (now: number) => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = now - this.lastDraw;
    if (dt < 1000 / FPS - 4 && !this.needDraw) return; // scratching redraws every frame, the glitter at 30 fps
    this.time += Math.min(dt, 100) * SPEED;
    this.lastDraw = now;
    this.draw();
  };

  /** Freeze on the current frame (after the reveal). */
  stop() { this.stopped = true; this.kick(); }

  dispose() {
    this.stop();
    cancelAnimationFrame(this.once);
    this.io?.disconnect();
    window.removeEventListener("scroll", this.onScroll);
    document.removeEventListener("visibilitychange", this.kick);
    clearTimeout(this.scrollTimer);
  }
}
