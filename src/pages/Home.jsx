import React, { useEffect, useReducer, useRef, useState } from "react";

/* =====================================================================
   Megumi Meme Studio – React version
   Usage:  import MegumiMemeStudio from "./MegumiMemeStudio";
           <MegumiMemeStudio />
   No dependencies besides React. Styles are injected by the component
   and scoped under ".mms" (uses native CSS nesting, supported in all
   current browsers).
   ===================================================================== */

/* ---------- data ---------- */
const FONTS = [
  ["Anton", 400], ["Bebas Neue", 400], ["Bangers", 400], ["Permanent Marker", 400],
  ["Orbitron", 900], ["Press Start 2P", 400], ["Russo One", 400], ["Black Ops One", 400],
  ["Creepster", 400], ["Pacifico", 400], ["Oswald", 700], ["Archivo Black", 400], ["Impact", 400],
];
const FONT_W = {};
FONTS.forEach((f) => { FONT_W[f[0]] = f[1]; });
const STYLES = [["glow", "Glow"], ["neon", "Neon"], ["classic", "Classic"], ["manga", "Manga"], ["outline", "Outline"], ["gradient", "Gradient"], ["glitch", "Glitch"]];
const PHRASES = ["HELL YEAH", "Did you say potential?", "Nah, I'd win", "BRUH 💀", "Absolute Cinema 🖐️🗿🤚", "With this treasure..."];
const GLOWS = ["#06b6d4", "#38bdf8", "#3b82f6", "#a855f7", "#ff2d95", "#ff4d4d", "#ffb020", "#a3e635", "#ffffff"];
const SHAPES = { land: [1280, 720], square: [1080, 1080], port: [810, 1080] };

function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- 10 generated templates (no external images) ---------- */
const TEMPLATES = [
  { id: "shadow", name: "Shadow Domain", tags: ["megumi", "shadow", "dark", "cyan", "hell yeah"], text: "HELL YEAH",
    look: { style: "glow", glow: "#06b6d4", color: "#ffffff", font: "Anton" },
    draw: function (c, w, h) {
      var r = rng(11), g = c.createRadialGradient(w * .5, h * .55, 0, w * .5, h * .55, Math.max(w, h) * .75);
      g.addColorStop(0, "#0e3552"); g.addColorStop(.55, "#06182b"); g.addColorStop(1, "#010409");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 7; i++) { c.strokeStyle = "rgba(56,214,255," + (0.16 - i * .018) + ")"; c.lineWidth = Math.max(1, w * .002); c.beginPath(); c.ellipse(w * .5, h * .95, w * (.18 + i * .1), h * (.06 + i * .045), 0, Math.PI, Math.PI * 2); c.stroke(); }
      c.save(); c.shadowColor = "#38d6ff"; c.shadowBlur = w * .02; c.fillStyle = "#000";
      for (var k = 0; k < 46; k++) { var x = r() * w, bw = w * (.012 + r() * .03), bh = h * (.1 + r() * .34 * (1 - Math.abs(x / w - .5) * 1.2)); c.beginPath(); c.moveTo(x - bw, h); c.quadraticCurveTo(x - bw * .2, h - bh * .6, x + (r() - .5) * bw * 2, h - bh); c.quadraticCurveTo(x + bw * .2, h - bh * .6, x + bw, h); c.closePath(); c.fill(); }
      c.restore(); c.fillStyle = "#000"; c.fillRect(0, h * .94, w, h * .06);
      for (var p = 0; p < 140; p++) { c.fillStyle = "rgba(120,230,255," + (r() * .7) + ")"; c.beginPath(); c.arc(r() * w, r() * h * .9, (r() * 2 + .4) * w / 900, 0, 7); c.fill(); }
    } },
  { id: "void", name: "Infinite Void", tags: ["gojo", "void", "blue", "nah id win", "domain"], text: "NAH, I'D WIN",
    look: { style: "neon", glow: "#3b82f6", color: "#ffffff", font: "Bebas Neue" },
    draw: function (c, w, h) {
      var r = rng(7), g = c.createRadialGradient(w * .5, h * .5, 0, w * .5, h * .5, Math.max(w, h) * .7);
      g.addColorStop(0, "#f2f8ff"); g.addColorStop(.12, "#6fb3ff"); g.addColorStop(.4, "#1736d8"); g.addColorStop(1, "#02031c");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (var i = 1; i < 14; i++) { c.strokeStyle = "rgba(255,255,255," + (0.5 / i + .04) + ")"; c.lineWidth = Math.max(1, w * .0015); c.beginPath(); c.arc(w * .5, h * .5, Math.min(w, h) * i * .075, 0, 7); c.stroke(); }
      for (var s = 0; s < 220; s++) { c.fillStyle = "rgba(255,255,255," + (r() * .8) + ")"; c.beginPath(); c.arc(r() * w, r() * h, (r() * 1.6 + .3) * w / 1000, 0, 7); c.fill(); }
      c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = Math.max(1, w * .002);
      for (var q = 0; q < 12; q++) { var x = r() * w, y = r() * h, L = w * (.01 + r() * .02); c.beginPath(); c.moveTo(x - L, y); c.lineTo(x + L, y); c.moveTo(x, y - L); c.lineTo(x, y + L); c.stroke(); }
    } },
  { id: "black", name: "Pitch Black", tags: ["gigachad", "chad", "meme", "classic", "black", "plain"], text: "AVERAGE CODE ENTHUSIAST",
    look: { style: "classic", glow: "#ffffff", color: "#ffffff", font: "Anton" },
    draw: function (c, w, h) {
      var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#151515"); g.addColorStop(1, "#030303");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      var r = rng(3); for (var i = 0; i < 400; i++) { c.fillStyle = "rgba(255,255,255," + r() * .05 + ")"; c.fillRect(r() * w, r() * h, w / 700, w / 700); }
    } },
  { id: "manga", name: "Manga Burst", tags: ["manga", "losers", "comic", "panel", "potential"], text: "DID YOU SAY POTENTIAL?",
    look: { style: "manga", glow: "#ff2d2d", color: "#ffffff", font: "Bangers" },
    draw: function (c, w, h) {
      c.fillStyle = "#f6f4ee"; c.fillRect(0, 0, w, h);
      var r = rng(5), cx = w * .5, cy = h * .45, R = Math.hypot(w, h);
      c.fillStyle = "#0a0a0a";
      for (var i = 0; i < 150; i++) { var a = r() * Math.PI * 2, d = .008 + r() * .03, inner = Math.min(w, h) * (.18 + r() * .12); c.beginPath(); c.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner); c.lineTo(cx + Math.cos(a - d) * R, cy + Math.sin(a - d) * R); c.lineTo(cx + Math.cos(a + d) * R, cy + Math.sin(a + d) * R); c.closePath(); c.fill(); }
      var step = w / 46; c.fillStyle = "rgba(0,0,0,.55)";
      for (var y = 0; y < h; y += step) for (var x = 0; x < w; x += step) { var t = Math.max(0, (y / h - .62)) * 1.6; var rad = step * .5 * t; if (rad > .3) { c.beginPath(); c.arc(x + ((Math.round(y / step) % 2) ? step / 2 : 0), y, rad, 0, 7); c.fill(); } }
    } },
  { id: "city", name: "Neon City", tags: ["cyberpunk", "neon", "futuristic", "city", "override"], text: "SYSTEM OVERRIDE",
    look: { style: "neon", glow: "#06b6d4", color: "#ffffff", font: "Orbitron" },
    draw: function (c, w, h) {
      var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#08021c"); g.addColorStop(.55, "#38105f"); g.addColorStop(.85, "#ff3d8b"); g.addColorStop(1, "#ffb347");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      var r = rng(21); c.fillStyle = "rgba(255,236,200,.92)"; c.beginPath(); c.arc(w * .72, h * .3, h * .13, 0, 7); c.fill();
      [["#0a0618", .5], ["#070412", .38]].forEach(function (L, li) {
        var x = 0; while (x < w) { var bw = w * (.03 + r() * .06), bh = h * (L[1] * (.4 + r() * .6)); c.fillStyle = L[0]; c.fillRect(x, h - bh, bw, bh);
          if (li === 1) { for (var wy = h - bh + h * .02; wy < h - h * .02; wy += h * .035) for (var wx = x + bw * .12; wx < x + bw - bw * .12; wx += bw * .24) if (r() > .55) { c.fillStyle = r() > .5 ? "#38d6ff" : "#ffd45e"; c.fillRect(wx, wy, bw * .1, h * .014); } }
          x += bw + w * .004; }
      });
    } },
  { id: "synth", name: "Synth Sunset", tags: ["synthwave", "retro", "sunset", "grid", "80s"], text: "ABSOLUTE CINEMA",
    look: { style: "gradient", glow: "#ff2d95", color: "#ffe066", font: "Russo One" },
    draw: function (c, w, h) {
      var g = c.createLinearGradient(0, 0, 0, h * .62); g.addColorStop(0, "#12012e"); g.addColorStop(1, "#6a1b7a");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      var sg = c.createLinearGradient(0, h * .18, 0, h * .6); sg.addColorStop(0, "#ffe066"); sg.addColorStop(1, "#ff2a8a");
      c.save(); c.beginPath(); c.arc(w * .5, h * .42, h * .24, 0, 7); c.clip(); c.fillStyle = sg; c.fillRect(0, 0, w, h);
      c.fillStyle = "#6a1b7a"; for (var i = 0; i < 7; i++) { c.fillRect(0, h * (.42 + i * .026), w, h * (.003 + i * .0027)); } c.restore();
      c.fillStyle = "#0c0120"; c.fillRect(0, h * .62, w, h * .38);
      c.strokeStyle = "#ff2d95"; c.lineWidth = Math.max(1, w * .002); c.shadowColor = "#ff2d95"; c.shadowBlur = w * .006;
      for (var v = -12; v <= 12; v++) { c.beginPath(); c.moveTo(w * .5 + v * w * .02, h * .62); c.lineTo(w * .5 + v * w * .16, h); c.stroke(); }
      for (var k = 1; k < 10; k++) { var y = h * .62 + (h * .38) * Math.pow(k / 10, 2.2); c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    } },
  { id: "storm", name: "Storm Bolt", tags: ["lightning", "storm", "electric", "dark"], text: "WITH THIS TREASURE...",
    look: { style: "glow", glow: "#a78bfa", color: "#ffffff", font: "Black Ops One" },
    draw: function (c, w, h) {
      var g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#090a1c"); g.addColorStop(1, "#1b1040");
      c.fillStyle = g; c.fillRect(0, 0, w, h); var r = rng(33);
      function bolt(x, y, ang, len, wd, depth) {
        c.beginPath(); c.moveTo(x, y); var px = x, py = y, n = 9;
        for (var i = 0; i < n; i++) { ang += (r() - .5) * .9; px += Math.cos(ang) * len / n; py += Math.sin(ang) * len / n; c.lineTo(px, py); if (depth > 0 && r() > .72) { c.stroke(); bolt(px, py, ang + (r() - .5) * 1.6, len * .5, wd * .6, depth - 1); c.beginPath(); c.moveTo(px, py); } }
        c.lineWidth = wd; c.stroke();
      }
      c.lineCap = "round"; c.lineJoin = "round";
      [[w * .3, 0], [w * .72, 0]].forEach(function (p, i) {
        c.save(); c.shadowColor = "#a78bfa"; c.shadowBlur = w * .03; c.strokeStyle = "#c4b5fd"; bolt(p[0], p[1], Math.PI / 2 + (i ? .1 : -.1), h * .95, w * .006, 2);
        c.shadowBlur = w * .008; c.strokeStyle = "#fff"; r = rng(33 + i); bolt(p[0], p[1], Math.PI / 2 + (i ? .1 : -.1), h * .95, w * .002, 0); c.restore();
      });
    } },
  { id: "aurora", name: "Aurora Mesh", tags: ["gradient", "aurora", "soft", "colorful"], text: "Main character energy",
    look: { style: "gradient", glow: "#ff7ad9", color: "#ffffff", font: "Pacifico" },
    draw: function (c, w, h) {
      c.fillStyle = "#080a1c"; c.fillRect(0, 0, w, h);
      [["#4a78ff", .2, .3, .5], ["#38d6ff", .75, .25, .45], ["#ff4fd8", .6, .8, .5], ["#7c3aed", .15, .85, .45], ["#22d3a0", .9, .75, .3]].forEach(function (b) {
        var R = Math.max(w, h) * b[3], g = c.createRadialGradient(w * b[1], h * b[2], 0, w * b[1], h * b[2], R);
        g.addColorStop(0, b[0] + "cc"); g.addColorStop(1, b[0] + "00"); c.fillStyle = g; c.fillRect(0, 0, w, h);
      });
    } },
  { id: "paper", name: "Paper White", tags: ["plain", "white", "clean", "classic"], text: "WHEN THE BUILD PASSES",
    look: { style: "classic", glow: "#000000", color: "#ffffff", font: "Anton" },
    draw: function (c, w, h) {
      c.fillStyle = "#f4f6f9"; c.fillRect(0, 0, w, h);
      c.strokeStyle = "rgba(30,50,90,.06)"; c.lineWidth = 1; var s = w / 40;
      for (var x = 0; x < w; x += s) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
      for (var y = 0; y < h; y += s) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    } },
  /* 10th template */
  { id: "crimson", name: "Crimson Eclipse", tags: ["red", "eclipse", "sukuna", "curse", "moon", "bruh"], text: "BRUH 💀",
    look: { style: "glitch", glow: "#ff4d4d", color: "#ffffff", font: "Bangers" },
    draw: function (c, w, h) {
      var r = rng(9), g = c.createRadialGradient(w * .5, h * .4, 0, w * .5, h * .4, Math.max(w, h) * .8);
      g.addColorStop(0, "#4a0812"); g.addColorStop(.5, "#14020a"); g.addColorStop(1, "#020001");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.save(); c.shadowColor = "#ff2d2d"; c.shadowBlur = w * .05; c.fillStyle = "#000";
      c.beginPath(); c.arc(w * .5, h * .4, h * .2, 0, 7); c.fill(); c.restore();
      c.strokeStyle = "rgba(255,77,77,.9)"; c.lineWidth = Math.max(1, w * .004);
      c.beginPath(); c.arc(w * .5, h * .4, h * .206, 0, 7); c.stroke();
      for (var i = 0; i < 130; i++) { c.fillStyle = "rgba(255," + Math.round(60 + r() * 60) + ",70," + (r() * .7) + ")"; c.beginPath(); c.arc(r() * w, r() * h, (r() * 2 + .4) * w / 900, 0, 7); c.fill(); }
    } },
];

/* ---------- Minimal GIF89a encoder: shared median-cut palette, Bayer dither, LZW ---------- */
const GIF_BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function gifBuildPalette(frames, w, h) {
  const hist = new Uint32Array(32768);
  const n = w * h;
  const step = Math.max(1, Math.floor(frames.length / 6));
  for (let f = 0; f < frames.length; f += step) {
    const d = frames[f];
    for (let i = 0; i < n; i += 3) {
      const o = i * 4;
      hist[((d[o] >> 3) << 10) | ((d[o + 1] >> 3) << 5) | (d[o + 2] >> 3)]++;
    }
  }
  const cols = [];
  for (let k = 0; k < 32768; k++) {
    if (hist[k]) cols.push({ r: k >> 10, g: (k >> 5) & 31, b: k & 31, c: hist[k] });
  }
  const boxes = [cols];
  while (boxes.length < 256) {
    let bi = -1, best = 0, bch = 0;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (b.length < 2) continue;
      let r0 = 31, r1 = 0, g0 = 31, g1 = 0, b0 = 31, b1 = 0, tot = 0;
      for (let j = 0; j < b.length; j++) {
        const c = b[j];
        if (c.r < r0) r0 = c.r; if (c.r > r1) r1 = c.r;
        if (c.g < g0) g0 = c.g; if (c.g > g1) g1 = c.g;
        if (c.b < b0) b0 = c.b; if (c.b > b1) b1 = c.b;
        tot += c.c;
      }
      const rr = r1 - r0, gr = g1 - g0, br = b1 - b0;
      const m = Math.max(rr, gr, br);
      const score = (m + 1) * Math.sqrt(tot);
      if (m > 0 && score > best) { best = score; bi = i; bch = rr === m ? 0 : gr === m ? 1 : 2; }
    }
    if (bi < 0) break;
    const b = boxes[bi];
    const key = bch === 0 ? "r" : bch === 1 ? "g" : "b";
    b.sort((x, y) => x[key] - y[key]);
    let tot = 0;
    for (let i = 0; i < b.length; i++) tot += b[i].c;
    let acc = 0, cut = 1;
    for (let i = 0; i < b.length; i++) {
      acc += b[i].c;
      if (acc >= tot / 2) { cut = Math.min(Math.max(i + 1, 1), b.length - 1); break; }
    }
    boxes.splice(bi, 1, b.slice(0, cut), b.slice(cut));
  }
  const pal = new Uint8Array(768);
  boxes.forEach((b, i) => {
    let r = 0, g = 0, bl = 0, t = 0;
    for (let j = 0; j < b.length; j++) { const c = b[j]; r += c.r * c.c; g += c.g * c.c; bl += c.b * c.c; t += c.c; }
    if (!t) return;
    pal[i * 3] = Math.min(255, Math.round(r / t) * 8 + 4);
    pal[i * 3 + 1] = Math.min(255, Math.round(g / t) * 8 + 4);
    pal[i * 3 + 2] = Math.min(255, Math.round(bl / t) * 8 + 4);
  });
  return { pal, count: boxes.length };
}

function gifIndexFrame(d, w, h, pal, count, lut) {
  const out = new Uint8Array(w * h);
  let p = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++, p++) {
      const o = p * 4;
      const t = (GIF_BAYER[((y & 3) << 2) | (x & 3)] - 7.5) * 0.9;
      let r = d[o] + t, g = d[o + 1] + t, b = d[o + 2] + t;
      r = r < 0 ? 0 : r > 255 ? 255 : r;
      g = g < 0 ? 0 : g > 255 ? 255 : g;
      b = b < 0 ? 0 : b > 255 ? 255 : b;
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      let idx = lut[key];
      if (idx < 0) {
        const kr = (key >> 10) * 8 + 4, kg = ((key >> 5) & 31) * 8 + 4, kb = (key & 31) * 8 + 4;
        let bd = 1e9; idx = 0;
        for (let i = 0; i < count; i++) {
          const dr = pal[i * 3] - kr, dg = pal[i * 3 + 1] - kg, db = pal[i * 3 + 2] - kb;
          const dist = dr * dr + dg * dg + db * db;
          if (dist < bd) { bd = dist; idx = i; }
        }
        lut[key] = idx;
      }
      out[p] = idx;
    }
  }
  return out;
}

function gifLZW(indices, minCode) {
  const clear = 1 << minCode, eoi = clear + 1;
  let codeSize = minCode + 1, next = eoi + 1;
  let dict = new Map();
  const bytes = [];
  let buf = 0, bits = 0;
  const emit = (c) => {
    buf |= c << bits; bits += codeSize;
    while (bits >= 8) { bytes.push(buf & 255); buf >>>= 8; bits -= 8; }
    if (next >= (1 << codeSize) && codeSize < 12) codeSize++;
  };
  const reset = () => { dict = new Map(); next = eoi + 1; codeSize = minCode + 1; };
  buf = clear; bits = codeSize;
  while (bits >= 8) { bytes.push(buf & 255); buf >>>= 8; bits -= 8; }
  let prefix = indices[0];
  for (let i = 1; i < indices.length; i++) {
    const k = indices[i];
    const key = (prefix << 8) | k;
    const found = dict.get(key);
    if (found !== undefined) { prefix = found; continue; }
    emit(prefix);
    if (next < 4096) {
      dict.set(key, next++);
    } else {
      buf |= clear << bits; bits += codeSize;
      while (bits >= 8) { bytes.push(buf & 255); buf >>>= 8; bits -= 8; }
      reset();
    }
    prefix = k;
  }
  emit(prefix);
  buf |= eoi << bits; bits += codeSize;
  while (bits >= 8) { bytes.push(buf & 255); buf >>>= 8; bits -= 8; }
  if (bits > 0) bytes.push(buf & 255);
  return bytes;
}

async function encodeGIF(frames, w, h, delayCs, onProgress) {
  const { pal, count } = gifBuildPalette(frames, w, h);
  const out = [];
  const push = (arr) => { for (let i = 0; i < arr.length; i++) out.push(arr[i]); };
  const le = (v) => [v & 255, (v >> 8) & 255];
  push([71, 73, 70, 56, 57, 97]);
  push(le(w)); push(le(h));
  push([0xF7, 0, 0]);
  push(pal);
  if (frames.length > 1) {
    push([0x21, 0xFF, 0x0B, 78, 69, 84, 83, 67, 65, 80, 69, 50, 46, 48, 3, 1, 0, 0, 0]);
  }
  const lut = new Int16Array(32768).fill(-1);
  for (let f = 0; f < frames.length; f++) {
    const idx = gifIndexFrame(frames[f], w, h, pal, count, lut);
    push([0x21, 0xF9, 0x04, 0x04]); push(le(delayCs)); push([0, 0]);
    push([0x2C, 0, 0, 0, 0]); push(le(w)); push(le(h)); push([0]);
    out.push(8);
    const data = gifLZW(idx, 8);
    for (let i = 0; i < data.length; i += 255) {
      const n = Math.min(255, data.length - i);
      out.push(n);
      for (let j = 0; j < n; j++) out.push(data[i + j]);
    }
    out.push(0);
    if (onProgress) onProgress((f + 1) / frames.length);
    await new Promise((r) => setTimeout(r, 0));
  }
  out.push(0x3B);
  return new Uint8Array(out);
}

/* ---------- canvas text engine (pure functions) ---------- */
function newLayer(S, over) {
  const L = { id: S.nextId++, text: "HELL YEAH", font: "Anton", size: 11, color: "#ffffff", glow: "#06b6d4", strength: 80, style: "glow", x: .5, y: .82, rot: 0, opacity: 100, spacing: 0, upper: true, shrink: true, fit: true, _b: null };
  for (const k in over) L[k] = over[k];
  return L;
}
function fontStr(L, size) { return FONT_W[L.font] + " " + size.toFixed(2) + 'px "' + L.font + '", Impact, "Arial Black", sans-serif'; }
const seg = (typeof Intl !== "undefined" && Intl.Segmenter) ? new Intl.Segmenter() : null;
function graphemes(s) { return seg ? Array.from(seg.segment(s), (x) => x.segment) : Array.from(s); }
function measure(c, str, sp) {
  if (!str) return 0;
  if (!sp) return c.measureText(str).width;
  const g = graphemes(str); let w = 0; g.forEach((ch) => { w += c.measureText(ch).width; });
  return w + sp * (g.length - 1);
}
function drawStr(c, str, y, sp, stroke) {
  if (!str) return;
  if (!sp) { c.textAlign = "center"; stroke ? c.strokeText(str, 0, y) : c.fillText(str, 0, y); return; }
  c.textAlign = "left";
  let x = -measure(c, str, sp) / 2;
  graphemes(str).forEach((ch) => { stroke ? c.strokeText(ch, x, y) : c.fillText(ch, x, y); x += c.measureText(ch).width + sp; });
}
function layout(c, L, W, H) {
  const base = L.size / 100 * H, raw = L.text.split("\n"), sp = L.spacing / 100;
  const lines = raw.map((s, i) => ({ str: L.upper ? s.toUpperCase() : s, size: (L.shrink && raw.length > 1 && i < raw.length - 1) ? base * .65 : base }));
  const wd = (l, size) => { c.font = fontStr(L, size); return measure(c, l.str, sp * size); };
  let f = 1;
  if (L.fit) { let mw = 0; lines.forEach((l) => { mw = Math.max(mw, wd(l, l.size)); }); if (mw > W * .92) f = W * .92 / mw; }
  let tot = 0, mxw = 0;
  lines.forEach((l) => { l.size *= f; l.w = wd(l, l.size); l.h = l.size * 1.12; tot += l.h; mxw = Math.max(mxw, l.w); });
  let y = -tot / 2; lines.forEach((l) => { l.y = y + l.h / 2; y += l.h; });
  return { lines, w: mxw, h: tot, sp };
}
function drawLine(c, L, str, y, size, sp, g) {
  const st = L.style, glow = L.glow, col = L.color;
  c.lineJoin = "round"; c.miterLimit = 2;
  const reset = () => { c.shadowBlur = 0; c.shadowOffsetX = 0; c.shadowOffsetY = 0; c.shadowColor = "rgba(0,0,0,0)"; };
  const fill = (color) => { c.fillStyle = color; drawStr(c, str, y, sp, false); };
  const stroke = (color, wd) => { c.strokeStyle = color; c.lineWidth = wd; drawStr(c, str, y, sp, true); };
  if (st === "glow") {
    c.shadowColor = glow; c.shadowOffsetX = 0; c.shadowOffsetY = 0;
    c.shadowBlur = g * size * .5; fill(col);
    c.shadowBlur = g * size * .28; fill(col);
    c.shadowBlur = g * size * .1; fill(col);
    reset(); stroke("rgba(0,0,0,.55)", size * .04);
  } else if (st === "neon") {
    c.shadowColor = glow; c.shadowBlur = g * size * .55; stroke(glow, size * .07);
    c.shadowBlur = g * size * .3; stroke(glow, size * .07);
    c.shadowBlur = g * size * .12; fill(col);
    reset(); fill(col);
  } else if (st === "classic") {
    c.shadowColor = glow; c.shadowBlur = g * size * .2; stroke("#000", size * .14);
    reset(); fill(col);
  } else if (st === "manga") {
    c.fillStyle = glow; c.save(); c.translate(size * .06, size * .06); drawStr(c, str, y, sp, false); c.restore();
    reset(); stroke("#000", size * (.1 + g * .08)); fill(col);
  } else if (st === "outline") {
    c.shadowColor = glow; c.shadowBlur = g * size * .4; stroke(col, size * .045);
    reset(); stroke(col, size * .045);
  } else if (st === "gradient") {
    const gr = c.createLinearGradient(0, y - size * .5, 0, y + size * .5); gr.addColorStop(0, col); gr.addColorStop(1, glow);
    c.shadowColor = glow; c.shadowBlur = g * size * .4; fill(gr);
    reset(); stroke("rgba(0,0,0,.4)", size * .03);
  } else if (st === "glitch") {
    const d = size * (.025 + g * .03);
    c.save(); c.globalAlpha *= .85; c.translate(-d, 0); fill("#ff2a6d"); c.restore();
    c.save(); c.globalAlpha *= .85; c.translate(d, 0); fill(glow); c.restore();
    c.shadowColor = glow; c.shadowBlur = g * size * .12; fill(col); reset();
  }
  reset();
}
function drawLayer(c, L, W, H, g, ui) {
  if (!L.text || !L.text.trim()) { if (ui) L._b = null; return; }
  const lay = layout(c, L, W, H), ge = (L.strength / 100) * g;
  c.save();
  c.translate(L.x * W, L.y * H); c.rotate(L.rot * Math.PI / 180);
  c.globalAlpha = L.opacity / 100; c.textBaseline = "middle";
  lay.lines.forEach((l) => { c.font = fontStr(L, l.size); drawLine(c, L, l.str, l.y, l.size, lay.sp * l.size, ge); });
  c.restore();
  if (ui) L._b = { cx: L.x * W, cy: L.y * H, w: lay.w + lay.lines[0].size * .3, h: lay.h + lay.lines[0].size * .2, rot: L.rot };
}
function drawOverlay(c, W, H, S) {
  const L = S.layers.find((l) => l.id === S.sel); if (!L || !L._b) return;
  const b = L._b, u = W / 1280 * 1.4 + .6;
  c.save(); c.translate(b.cx, b.cy); c.rotate(b.rot * Math.PI / 180);
  c.setLineDash([6 * u, 5 * u]); c.lineWidth = 1.6 * u; c.strokeStyle = "rgba(56,214,255,.95)";
  c.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h); c.setLineDash([]);
  c.fillStyle = "#38d6ff";
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach((p) => { c.fillRect(p[0] * b.w / 2 - 3.5 * u, p[1] * b.h / 2 - 3.5 * u, 7 * u, 7 * u); });
  c.restore();
  if (S.guides.x || S.guides.y) {
    c.save(); c.strokeStyle = "rgba(255,45,149,.9)"; c.lineWidth = 1.4 * u; c.setLineDash([8 * u, 6 * u]);
    if (S.guides.x) { c.beginPath(); c.moveTo(W / 2, 0); c.lineTo(W / 2, H); c.stroke(); }
    if (S.guides.y) { c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.stroke(); }
    c.restore();
  }
}
function renderScene(c, W, H, o, S, fin) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, W, H); c.drawImage(fin, 0, 0, W, H);
  const g = o.phase == null ? 1 : .55 + .45 * (.5 - .5 * Math.cos(o.phase * Math.PI * 2));
  S.layers.forEach((L) => drawLayer(c, L, W, H, g, o.ui));
  if (o.ui) drawOverlay(c, W, H, S);
}
function loadFont(n, cb) {
  if (n === "Impact" || typeof document === "undefined" || !document.fonts) return;
  document.fonts.load(FONT_W[n] + ' 48px "' + n + '"').then(cb, () => { });
}

/* ---------- small UI pieces ---------- */
const Svg = ({ children, sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const Slider = ({ id, label, val, unit = "", min, max, step, onChange, disabled }) => (
  <div>
    <div className="field-head"><label className="lbl" htmlFor={id}>{label}</label><span className="val">{val}{unit}</span></div>
    <input type="range" id={id} min={min} max={max} step={step} value={val} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} />
  </div>
);
function Thumb({ t }) {
  const ref = useRef(null);
  useEffect(() => { const c = ref.current; t.draw(c.getContext("2d"), c.width, c.height); }, [t]);
  return <canvas ref={ref} width={240} height={135} />;
}

/* ===================================================================== */
export default function Home() {
  const [, force] = useReducer((n) => n + 1, 0);
  const cvRef = useRef(null), txtRef = useRef(null), fileRef = useRef(null);
  const [tab, setTab] = useState("text");
  const [search, setSearch] = useState("");
  const [over, setOver] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);
  const [result, setResult] = useState(null);
  const [prog, setProg] = useState(null);

  // Mutable engine state lives in a ref; React re-renders the controls via force().
  const R = useRef(null);
  if (!R.current) {
    const S = {
      layers: [], sel: null, nextId: 1,
      fx: { brightness: 0, contrast: 0, saturation: 0, blur: 0, dim: 0, vignette: 0 },
      bg: { kind: "tpl", id: "shadow", img: null, shape: "land" },
      pulse: true, period: 1.2, gifW: 480, dirty: false, guides: { x: false, y: false },
    };
    const first = newLayer(S, { text: TEMPLATES[0].text });
    S.layers.push(first); S.sel = first.id;
    R.current = { S, base: null, fin: null, ctx: null, raf: 0, queued: false, exporting: false, busy: false, ptrs: {}, dragging: false, lastP: null, pinch: null, fxQ: false, toastT: 0, resUrl: null, resBlob: null };
  }
  const r = R.current, S = r.S;
  const cur = () => S.layers.find((l) => l.id === S.sel) || null;
  const L = cur();

  /* ----- draw loop ----- */
  const redraw = () => { if (r.queued) return; r.queued = true; r.raf = requestAnimationFrame(frame); };
  const frame = () => {
    r.queued = false;
    const cv = cvRef.current;
    if (r.exporting || !cv || !r.ctx) return;
    const ph = S.pulse ? (performance.now() / 1000 / S.period) % 1 : null;
    renderScene(r.ctx, cv.width, cv.height, { phase: ph, ui: true }, S, r.fin);
    if (S.pulse && !document.hidden) redraw();
  };
  const sync = () => { force(); redraw(); };

  /* ----- background + picture fx ----- */
  const applyFx = () => {
    const cv = cvRef.current; if (!cv) return;
    const w = r.base.width, h = r.base.height, fx = S.fx;
    if (r.fin.width !== w || r.fin.height !== h) { r.fin.width = w; r.fin.height = h; }
    const c = r.fin.getContext("2d", { willReadFrequently: true });
    c.clearRect(0, 0, w, h); c.save();
    if (fx.blur > 0 && typeof c.filter === "string") c.filter = "blur(" + (fx.blur * w / 1280) + "px)";
    c.drawImage(r.base, 0, 0); c.restore();
    if (fx.brightness || fx.contrast || fx.saturation) {
      const id = c.getImageData(0, 0, w, h), d = id.data;
      const b = fx.brightness * 2.55, k = fx.contrast / 100 + 1, s = fx.saturation / 100 + 1;
      for (let i = 0; i < d.length; i += 4) {
        let rr = d[i], g = d[i + 1], bl = d[i + 2];
        const l = .299 * rr + .587 * g + .114 * bl;
        rr = l + (rr - l) * s; g = l + (g - l) * s; bl = l + (bl - l) * s;
        d[i] = (rr - 128) * k + 128 + b; d[i + 1] = (g - 128) * k + 128 + b; d[i + 2] = (bl - 128) * k + 128 + b;
      }
      c.putImageData(id, 0, 0);
    }
    if (fx.dim) { c.fillStyle = "rgba(0,0,0," + fx.dim / 100 + ")"; c.fillRect(0, 0, w, h); }
    if (fx.vignette) {
      const vg = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .25, w / 2, h / 2, Math.hypot(w, h) * .55);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0," + (fx.vignette / 100) * .9 + ")");
      c.fillStyle = vg; c.fillRect(0, 0, w, h);
    }
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    redraw();
  };
  const queueFx = () => { if (r.fxQ) return; r.fxQ = true; requestAnimationFrame(() => { r.fxQ = false; applyFx(); }); };
  const rebuildBase = () => {
    let w, h;
    if (S.bg.kind === "img" && S.bg.img) {
      const im = S.bg.img, sc = Math.min(1, 1280 / Math.max(im.naturalWidth, im.naturalHeight));
      w = Math.max(2, Math.round(im.naturalWidth * sc)); h = Math.max(2, Math.round(im.naturalHeight * sc));
      r.base.width = w; r.base.height = h; r.base.getContext("2d").drawImage(im, 0, 0, w, h);
    } else {
      const t = TEMPLATES.find((x) => x.id === S.bg.id) || TEMPLATES[0], sz = SHAPES[S.bg.shape];
      w = sz[0]; h = sz[1]; r.base.width = w; r.base.height = h; t.draw(r.base.getContext("2d"), w, h);
    }
    applyFx();
  };

  /* ----- toast / results / export ----- */
  const toast = (msg) => { setToastMsg(msg); setToastOn(true); clearTimeout(r.toastT); r.toastT = setTimeout(() => setToastOn(false), 2600); };
  const closeResult = () => { if (r.resUrl) { URL.revokeObjectURL(r.resUrl); r.resUrl = null; } r.resBlob = null; setResult(null); };
  const openResult = (blob, name, meta) => {
    if (r.resUrl) URL.revokeObjectURL(r.resUrl);
    r.resUrl = URL.createObjectURL(blob); r.resBlob = blob;
    setResult({ url: r.resUrl, name, blob, meta: meta || (name + " · " + (blob.size / 1024).toFixed(0) + " KB") });
  };
  const stillBlob = () => {
    const cv = cvRef.current, c = document.createElement("canvas"); c.width = cv.width; c.height = cv.height;
    renderScene(c.getContext("2d"), c.width, c.height, { phase: null, ui: false }, S, r.fin);
    return new Promise((res) => c.toBlob(res, "image/png"));
  };
  const saveBlob = (blob, name, quiet) => {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    if (!quiet) { toast("Download started. If nothing happens, press and hold the preview image."); openResult(blob, name); }
  };
  const copyBlob = async (blob) => {
    try { await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); toast("Image copied to clipboard"); return true; }
    catch (e) { toast("Copying is blocked here. Use Save, or press and hold the image."); return false; }
  };
  const makeGIF = async () => {
    if (r.busy) return; r.busy = true; setProg(2); r.exporting = true;
    try {
      const cv = cvRef.current, W0 = cv.width, H0 = cv.height, tw = Math.min(S.gifW, W0), th = Math.round(H0 * tw / W0);
      const n = S.pulse ? Math.round(S.period * 20) : 1, oc = document.createElement("canvas"); oc.width = tw; oc.height = th;
      const oc2 = oc.getContext("2d", { willReadFrequently: true }), frames = [];
      for (let i = 0; i < n; i++) {
        renderScene(oc2, tw, th, { phase: S.pulse ? i / n : null, ui: false }, S, r.fin);
        frames.push(oc2.getImageData(0, 0, tw, th).data); setProg(5 + 35 * (i + 1) / n);
        if (i % 3 === 2) await new Promise((res) => setTimeout(res, 0));
      }
      const bytes = await encodeGIF(frames, tw, th, 5, (p) => setProg(40 + 60 * p));
      const blob = new Blob([bytes], { type: "image/gif" });
      openResult(blob, "meme-" + Date.now() + ".gif", tw + "×" + th + " · " + n + " frame" + (n > 1 ? "s" : "") + " · " + (blob.size / 1024).toFixed(0) + " KB");
    } catch (err) { toast("GIF export failed. Try a smaller width."); }
    r.exporting = false; r.busy = false; setProg(null); redraw();
  };

  /* ----- layers ----- */
  const setL = (k, v) => { const l = cur(); if (l) { l[k] = v; sync(); } };
  const selectLayer = (id) => { S.sel = id; sync(); };
  const addLayer = () => {
    const c = cur();
    const l = newLayer(S, { text: "NEW TEXT", y: .5, glow: c ? c.glow : "#06b6d4", font: c ? c.font : "Anton", style: c ? c.style : "glow" });
    S.layers.push(l); S.sel = l.id; S.dirty = true; sync();
    setTimeout(() => { if (txtRef.current) { txtRef.current.focus(); txtRef.current.select(); } }, 0);
  };
  const deleteLayer = () => {
    const c = cur(); if (!c) return;
    S.layers = S.layers.filter((x) => x !== c);
    S.sel = S.layers.length ? S.layers[S.layers.length - 1].id : null; sync();
  };
  const duplicate = () => { const c = cur(); if (!c) return; const d = newLayer(S, c); d.y = Math.min(.95, c.y + .08); d.x = Math.min(.95, c.x + .02); S.layers.push(d); S.sel = d.id; sync(); };
  const moveLayer = (dir) => {
    const c = cur(), i = S.layers.indexOf(c), j = i + dir;
    if (!c || j < 0 || j >= S.layers.length) return;
    S.layers.splice(i, 1); S.layers.splice(j, 0, c); sync();
  };
  const place = (p) => {
    const c = cur(); if (!c) return;
    if (p === "top") c.y = .14; else if (p === "middle") c.y = .5; else if (p === "bottom") c.y = .84; else c.x = .5;
    sync();
  };
  const applyLook = (look) => { const c = cur(); if (!c) return; for (const k in look) c[k] = look[k]; loadFont(c.font, redraw); sync(); };

  /* ----- templates ----- */
  const pickTemplate = (t) => {
    S.bg = { kind: "tpl", id: t.id, img: null, shape: S.bg.shape };
    const c = cur();
    if (c && !S.dirty) { c.text = t.text; for (const k in t.look) c[k] = t.look[k]; loadFont(c.font, redraw); }
    rebuildBase(); force();
  };
  const surprise = () => {
    const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    let c = cur(); if (!c) { addLayer(); c = cur(); }
    S.dirty = false; pickTemplate(t);
    c = cur();
    c.glow = GLOWS[Math.floor(Math.random() * GLOWS.length)];
    c.style = STYLES[Math.floor(Math.random() * STYLES.length)][0];
    c.font = FONTS[Math.floor(Math.random() * (FONTS.length - 1))][0]; loadFont(c.font, redraw);
    c.text = PHRASES[Math.floor(Math.random() * PHRASES.length)]; sync();
  };
  const loadImageFile = (file) => {
    if (!file || !/^image\//.test(file.type)) { toast("That file is not an image."); return; }
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { S.bg = { kind: "img", id: "custom", img: im, shape: S.bg.shape }; rebuildBase(); force(); toast("Image loaded"); };
    im.onerror = () => toast("Could not read that image. Try a PNG or JPG.");
    im.src = url;
  };

  /* ----- pointer interaction ----- */
  const pt = (e) => { const b = cvRef.current.getBoundingClientRect(); return { x: (e.clientX - b.left) / b.width, y: (e.clientY - b.top) / b.height, cx: e.clientX, cy: e.clientY }; };
  const hit = (p) => {
    const cv = cvRef.current, px = p.x * cv.width, py = p.y * cv.height;
    for (let i = S.layers.length - 1; i >= 0; i--) {
      const l = S.layers[i], b = l._b; if (!b) continue;
      const a = -b.rot * Math.PI / 180, dx = px - b.cx, dy = py - b.cy;
      const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a), pad = cv.width * .015;
      if (Math.abs(lx) <= b.w / 2 + pad && Math.abs(ly) <= b.h / 2 + pad) return l;
    }
    return null;
  };
  const onDown = (e) => {
    e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) { }
    r.ptrs[e.pointerId] = pt(e);
    const n = Object.keys(r.ptrs).length, p = r.ptrs[e.pointerId];
    if (n === 1) {
      const h = hit(p); if (h && h.id !== S.sel) selectLayer(h.id);
      r.dragging = true; r.lastP = p; e.currentTarget.classList.add("dragging");
    } else if (n === 2) {
      const c = cur(), k = Object.keys(r.ptrs), a = r.ptrs[k[0]], b = r.ptrs[k[1]];
      if (c) r.pinch = { d: Math.hypot(a.cx - b.cx, a.cy - b.cy) || 1, a: Math.atan2(b.cy - a.cy, b.cx - a.cx), size: c.size, rot: c.rot };
      r.dragging = false;
    }
  };
  const onMove = (e) => {
    if (!r.ptrs[e.pointerId]) return;
    r.ptrs[e.pointerId] = pt(e);
    const c = cur(); if (!c) return;
    if (Object.keys(r.ptrs).length >= 2 && r.pinch) {
      const k = Object.keys(r.ptrs), a = r.ptrs[k[0]], b = r.ptrs[k[1]];
      const d = Math.hypot(a.cx - b.cx, a.cy - b.cy), ang = Math.atan2(b.cy - a.cy, b.cx - a.cx);
      c.size = Math.max(3, Math.min(40, r.pinch.size * d / r.pinch.d));
      let rr = r.pinch.rot + (ang - r.pinch.a) * 180 / Math.PI; rr = ((rr + 540) % 360) - 180; c.rot = Math.round(rr);
      sync(); return;
    }
    if (!r.dragging) return;
    const p = r.ptrs[e.pointerId];
    c.x += p.x - r.lastP.x; c.y += p.y - r.lastP.y; r.lastP = p;
    c.x = Math.max(0, Math.min(1, c.x)); c.y = Math.max(0, Math.min(1, c.y));
    const sx = Math.abs(c.x - .5) < .015, sy = Math.abs(c.y - .5) < .015;
    S.guides.x = sx; S.guides.y = sy; if (sx) c.x = .5; if (sy) c.y = .5;
    S.dirty = true; redraw();
  };
  const onUp = (e) => {
    delete r.ptrs[e.pointerId];
    const n = Object.keys(r.ptrs).length;
    if (n < 2) r.pinch = null;
    if (n === 0) { r.dragging = false; e.currentTarget.classList.remove("dragging"); S.guides = { x: false, y: false }; redraw(); }
    else if (n === 1) { r.lastP = r.ptrs[Object.keys(r.ptrs)[0]]; r.dragging = true; }
  };
  const onViewportKey = (e) => {
    const c = cur(); if (!c) return;
    const st = e.shiftKey ? .03 : .005; let used = true;
    if (e.key === "ArrowLeft") c.x -= st; else if (e.key === "ArrowRight") c.x += st;
    else if (e.key === "ArrowUp") c.y -= st; else if (e.key === "ArrowDown") c.y += st;
    else if (e.key === "Delete" || e.key === "Backspace") { deleteLayer(); } else used = false;
    if (used) { e.preventDefault(); const k = cur(); if (k) { k.x = Math.max(0, Math.min(1, k.x)); k.y = Math.max(0, Math.min(1, k.y)); } redraw(); }
  };

  /* ----- boot ----- */
  useEffect(() => {
    r.base = document.createElement("canvas"); r.fin = document.createElement("canvas");
    r.ctx = cvRef.current.getContext("2d");
    FONTS.forEach((f) => loadFont(f[0], redraw));
    rebuildBase(); force();
    const onVis = () => { if (!document.hidden) redraw(); };
    const onPaste = (e) => {
      const items = e.clipboardData && e.clipboardData.items; if (!items) return;
      for (let i = 0; i < items.length; i++) if (items[i].type.indexOf("image") === 0) { loadImageFile(items[i].getAsFile()); e.preventDefault(); break; }
    };
    const onEsc = (e) => { if (e.key === "Escape" && r.resUrl) closeResult(); };
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("paste", onPaste);
    document.addEventListener("keydown", onEsc);
    return () => {
      cancelAnimationFrame(r.raf); r.queued = false;
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("keydown", onEsc);
      clearTimeout(r.toastT);
      if (r.resUrl) URL.revokeObjectURL(r.resUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----- derived ----- */
  const q = search.trim().toLowerCase();
  const tplList = TEMPLATES.filter((t) => !q || t.name.toLowerCase().includes(q) || t.tags.some((x) => x.includes(q)));
  const TABS = [["text", "Text"], ["style", "Style"], ["image", "Image"]];
  const onTabKey = (e, i) => {
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (n) { const nx = TABS[(i + n + TABS.length) % TABS.length][0]; setTab(nx); document.getElementById("mms-tab-" + nx)?.focus(); }
  };
  const dropProps = {
    onDragOver: (e) => { e.preventDefault(); setOver(true); },
    onDragLeave: () => setOver(false),
    onDrop: (e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) loadImageFile(e.dataTransfer.files[0]); },
  };
  const dis = !L;

  return (
    <div className="mms">
      <style>{CSS}</style>

      <header className="top">
        <div className="wrap">
          <div className="brand">
            <div className="mark" aria-hidden="true">M</div>
            <div>
              <h1>Megumi Meme Studio</h1>
              <p>Glowing text, drag to place, export PNG or animated GIF</p>
            </div>
          </div>
          <div className="top-actions">
            <button className="btn sm" type="button" onClick={surprise}>
              <Svg><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></Svg>
              <span>Surprise me</span>
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="app">
          {/* ---------- stage ---------- */}
          <section className="stage-col" aria-label="Canvas">
            <div className="card stage" {...dropProps}>
              <div className="stage-head">
                <div className="hint">
                  <Svg><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" /></Svg>
                  <span>Drag anywhere on the image to move the selected text. Pinch with two fingers to resize and rotate.</span>
                </div>
                {S.pulse && <span className="badge"><i />Glow pulse on</span>}
              </div>
              <div className="viewport" tabIndex={0} aria-label="Meme canvas. Arrow keys nudge the selected text." onKeyDown={onViewportKey}>
                <canvas ref={cvRef} className="cv" width={1280} height={720}
                  onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
              </div>
              <div className="actions">
                <button className="btn primary" type="button" onClick={async () => saveBlob(await stillBlob(), "meme-" + Date.now() + ".png")}>
                  <Svg><path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" /></Svg>Save PNG
                </button>
                <button className="btn" type="button" onClick={async () => { const b = await stillBlob(); const ok = await copyBlob(b); if (!ok) openResult(b, "meme-" + Date.now() + ".png"); }}>
                  <Svg><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></Svg>Copy image
                </button>
                <button className="btn" type="button" disabled={prog !== null} onClick={makeGIF}>
                  <Svg><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M8 11v2M8 11h-1.5a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1H8M12 10v4M16 10h2M16 10v4M16 12h1.5" /></Svg>Make GIF
                </button>
                <button className="btn" type="button" onClick={() => { const c = cur(); if (c) { c.x = .5; c.y = .82; c.rot = 0; sync(); } }}>
                  <Svg><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></Svg>Reset position
                </button>
              </div>
              {prog !== null && <div className="progress"><i style={{ width: prog + "%" }} /></div>}
              <div className="exportbar">
                <label className="opt" htmlFor="pulseToggle">
                  <span className="switch">
                    <input type="checkbox" id="pulseToggle" checked={S.pulse} onChange={(e) => { S.pulse = e.target.checked; sync(); }} /><span />
                  </span>
                  Pulse the glow (animated)
                </label>
                <div className="sel">
                  <label htmlFor="pulseSpeed">Speed</label>
                  <select id="pulseSpeed" value={String(S.period)} onChange={(e) => { S.period = Number(e.target.value); force(); }}>
                    <option value="2">Slow</option><option value="1.2">Normal</option><option value="0.8">Fast</option>
                  </select>
                  <label htmlFor="gifWidth">GIF width</label>
                  <select id="gifWidth" value={String(S.gifW)} onChange={(e) => { S.gifW = Number(e.target.value); force(); }}>
                    <option value="320">320 px</option><option value="480">480 px</option><option value="640">640 px</option>
                  </select>
                  <a className="btn sm" href="https://giphy.com/upload" target="_blank" rel="noreferrer noopener">Upload to GIPHY</a>
                </div>
              </div>
            </div>
            <div className="card note">
              <Svg><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>
              <div><b>Everything stays on your device</b>Images and text are rendered on this page and never uploaded. To post to GIPHY, make the GIF, save it, then use the upload link.</div>
            </div>
          </section>

          {/* ---------- controls ---------- */}
          <aside className="card panel" aria-label="Controls">
            <div className="tabs" role="tablist" aria-label="Editor sections">
              {TABS.map(([id, label], i) => (
                <button key={id} className="tab" role="tab" type="button" id={"mms-tab-" + id}
                  aria-controls={"mms-pane-" + id} aria-selected={tab === id} tabIndex={tab === id ? 0 : -1}
                  onClick={() => setTab(id)} onKeyDown={(e) => onTabKey(e, i)}>{label}</button>
              ))}
            </div>

            {/* 10 meme templates: small horizontal scroll strip */}
            <div className="strip-wrap">
              <div className="strip-head">
                <span className="lbl">Meme templates <span className="count">{tplList.length}/{TEMPLATES.length}</span></span>
                <input type="text" className="strip-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" autoComplete="off" aria-label="Search templates" />
              </div>
              <div className="strip" role="list">
                {tplList.map((t) => (
                  <button key={t.id} type="button" role="listitem" className="tpl" title={t.name}
                    aria-pressed={S.bg.kind === "tpl" && S.bg.id === t.id} onClick={() => pickTemplate(t)}>
                    <Thumb t={t} /><span>{t.name}</span>
                  </button>
                ))}
                {!tplList.length && <div className="empty">No match. Try neon, manga or shadow.</div>}
              </div>
            </div>

            {/* TEXT */}
            {tab === "text" && (
              <div className="tabpane" id="mms-pane-text" role="tabpanel" aria-labelledby="mms-tab-text">
                <div>
                  <div className="field-head"><span className="lbl">Text layers</span>
                    <button className="btn sm" type="button" onClick={addLayer}>+ Add text</button></div>
                  <div className="layers">
                    {S.layers.map((l, i) => (
                      <button key={l.id} type="button" className="layer-chip" aria-pressed={l.id === S.sel} onClick={() => selectLayer(l.id)}>
                        <b>{i + 1}</b><span>{(l.text || "(empty)").replace(/\n/g, " ")}</span>
                      </button>
                    ))}
                  </div>
                  <div className="row" style={{ marginTop: 8 }}>
                    <button className="btn sm" type="button" disabled={dis} onClick={duplicate}>Duplicate</button>
                    <button className="btn sm" type="button" disabled={dis} onClick={() => moveLayer(1)}>Bring forward</button>
                    <button className="btn sm" type="button" disabled={dis} onClick={() => moveLayer(-1)}>Send back</button>
                    <button className="btn sm danger" type="button" disabled={dis} onClick={deleteLayer}>Delete</button>
                  </div>
                </div>
                <div>
                  <div className="field-head"><label className="lbl" htmlFor="txt">Text content</label><span className="lbl nocase">One line per row</span></div>
                  <textarea id="txt" ref={txtRef} rows={2} placeholder="Type your meme text" disabled={dis}
                    value={L ? L.text : ""} onChange={(e) => { const c = cur(); if (c) { c.text = e.target.value; S.dirty = true; sync(); } }} />
                  <div className="row" style={{ marginTop: 8 }}>
                    {PHRASES.map((t) => (
                      <button key={t} className="chip" type="button" onClick={() => { const c = cur(); if (c) { c.text = t; S.dirty = true; sync(); } }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="sliders">
                  <Slider id="size" label="Size" val={L ? L.size : 0} unit="%" min={3} max={40} step={0.5} disabled={dis} onChange={(v) => setL("size", v)} />
                  <Slider id="rot" label="Rotation" val={L ? L.rot : 0} unit="°" min={-180} max={180} step={1} disabled={dis} onChange={(v) => setL("rot", v)} />
                  <Slider id="opacity" label="Opacity" val={L ? L.opacity : 0} unit="%" min={5} max={100} step={1} disabled={dis} onChange={(v) => setL("opacity", v)} />
                  <Slider id="spacing" label="Letter spacing" val={L ? L.spacing : 0} min={-5} max={40} step={1} disabled={dis} onChange={(v) => setL("spacing", v)} />
                </div>
                <div>
                  <div className="field-head"><span className="lbl">Place</span></div>
                  <div className="row">
                    <button className="chip" type="button" onClick={() => place("top")}>Top</button>
                    <button className="chip" type="button" onClick={() => place("middle")}>Middle</button>
                    <button className="chip" type="button" onClick={() => place("bottom")}>Bottom</button>
                    <button className="chip" type="button" onClick={() => place("center")}>Center horizontally</button>
                  </div>
                </div>
                <div className="sep" />
                <div className="toggles">
                  {[["upper", "All caps"], ["shrink", "Shrink lines above the last one"], ["fit", "Auto-fit to image width"]].map(([k, label]) => (
                    <label key={k} className="toggle">{label}
                      <input type="checkbox" checked={L ? !!L[k] : false} disabled={dis} onChange={(e) => setL(k, e.target.checked)} />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STYLE */}
            {tab === "style" && (
              <div className="tabpane" id="mms-pane-style" role="tabpanel" aria-labelledby="mms-tab-style">
                <div>
                  <div className="field-head"><span className="lbl">Text effect</span></div>
                  <div className="stylegrid">
                    {STYLES.map(([id, label]) => (
                      <button key={id} className="chip" type="button" aria-pressed={!!L && L.style === id} onClick={() => setL("style", id)}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-head"><span className="lbl">Looks</span><span className="lbl nocase">Effect, font and colors in one tap</span></div>
                  <div className="looks">
                    {TEMPLATES.map((t) => (
                      <button key={t.id} className="chip" type="button" onClick={() => applyLook(t.look)}>{t.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-head"><span className="lbl">Font</span></div>
                  <div className="fontgrid">
                    {FONTS.map(([name, wt]) => (
                      <button key={name} className="fontbtn" type="button" aria-pressed={!!L && L.font === name}
                        onClick={() => { const c = cur(); if (c) { c.font = name; loadFont(name, redraw); sync(); } }}>
                        <span className="sample" style={{ fontFamily: `'${name}',Impact,sans-serif`, fontWeight: wt }}>Aa</span>
                        <small>{name}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="two">
                  <div>
                    <div className="field-head"><label className="lbl" htmlFor="color">Text color</label></div>
                    <div className="colorbox"><input type="color" id="color" value={L ? L.color : "#ffffff"} disabled={dis} onChange={(e) => setL("color", e.target.value)} /><span>{L ? L.color : ""}</span></div>
                  </div>
                  <div>
                    <div className="field-head"><label className="lbl" htmlFor="glow">Glow color</label></div>
                    <div className="colorbox"><input type="color" id="glow" value={L ? L.glow : "#06b6d4"} disabled={dis} onChange={(e) => setL("glow", e.target.value)} /><span>{L ? L.glow : ""}</span></div>
                  </div>
                </div>
                <div>
                  <div className="field-head"><span className="lbl">Glow swatches</span></div>
                  <div className="swatches">
                    {GLOWS.map((c) => (
                      <button key={c} type="button" className="sw" style={{ background: c }} aria-label={"Glow " + c} onClick={() => setL("glow", c)} />
                    ))}
                  </div>
                </div>
                <Slider id="strength" label="Glow and stroke intensity" val={L ? L.strength : 0} unit="%" min={0} max={100} step={1} disabled={dis} onChange={(v) => setL("strength", v)} />
              </div>
            )}

            {/* IMAGE */}
            {tab === "image" && (
              <div className="tabpane" id="mms-pane-image" role="tabpanel" aria-labelledby="mms-tab-image">
                <div className={"drop" + (over ? " over" : "")} {...dropProps}>
                  <Svg sw={1.8}><path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></Svg>
                  <p><b>Use your own image</b>Drop a file here, paste from the clipboard, or choose one.</p>
                  <button className="btn sm" type="button" style={{ marginLeft: "auto" }} onClick={() => fileRef.current && fileRef.current.click()}>Choose</button>
                  <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => { loadImageFile(e.target.files[0]); e.target.value = ""; }} />
                </div>
                {S.bg.kind === "tpl" && (
                  <div>
                    <div className="field-head"><label className="lbl" htmlFor="shape">Template shape</label></div>
                    <select id="shape" className="full" value={S.bg.shape} onChange={(e) => { S.bg.shape = e.target.value; rebuildBase(); force(); }}>
                      <option value="land">Landscape 16:9</option>
                      <option value="square">Square 1:1</option>
                      <option value="port">Portrait 3:4</option>
                    </select>
                  </div>
                )}
                <div className="sep" />
                <div className="field-head"><span className="lbl">Picture adjustments</span>
                  <button className="btn sm" type="button" onClick={() => { Object.keys(S.fx).forEach((k) => { S.fx[k] = 0; }); force(); applyFx(); }}>Reset</button></div>
                <div className="sliders">
                  {[["brightness", "Brightness", -60, 60], ["contrast", "Contrast", -60, 80], ["saturation", "Saturation", -100, 100], ["blur", "Blur", 0, 20], ["dim", "Darken", 0, 90], ["vignette", "Vignette", 0, 100]].map(([k, label, mn, mx]) => (
                    <Slider key={k} id={k} label={label} val={S.fx[k]} min={mn} max={mx} step={1} onChange={(v) => { S.fx[k] = v; force(); queueFx(); }} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <footer>
          <span>Shortcuts on the canvas: <kbd>Arrow keys</kbd> nudge, <kbd>Shift</kbd> nudges more, <kbd>Delete</kbd> removes the selected text.</span>
          <span>Rendered locally in your browser.</span>
        </footer>
      </main>

      {result && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="mms-ovTitle" onClick={(e) => { if (e.target === e.currentTarget) closeResult(); }}>
          <div className="sheet">
            <h2 id="mms-ovTitle">{/gif$/.test(result.name) ? "Your GIF is ready" : "Your meme is ready"}</h2>
            <div className="pv"><img src={result.url} alt="Exported meme preview" /></div>
            <div className="meta">{result.meta}</div>
            <div className="row">
              <button className="btn primary" type="button" autoFocus onClick={() => saveBlob(result.blob, result.name, true)}>Save file</button>
              {/png$/.test(result.name) && <button className="btn" type="button" onClick={() => copyBlob(result.blob)}>Copy image</button>}
              <a className="btn" href="https://giphy.com/upload" target="_blank" rel="noreferrer noopener">Open GIPHY upload</a>
              <button className="btn" type="button" style={{ marginLeft: "auto" }} onClick={closeResult}>Close</button>
            </div>
            <div className="meta ui">If saving is blocked in your view, press and hold the image (or right-click it) and choose Save image.</div>
          </div>
        </div>
      )}
      <div className={"toast" + (toastOn ? " show" : "")} role="status" aria-live="polite">{toastMsg}</div>
    </div>
  );
}

/* ---------- styles (scoped under .mms via CSS nesting) ---------- */
const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Bangers&family=Permanent+Marker&family=Orbitron:wght@900&family=Press+Start+2P&family=Russo+One&family=Black+Ops+One&family=Creepster&family=Pacifico&family=Oswald:wght@700&family=Archivo+Black&family=Unbounded:wght@600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap");
@keyframes mms-blip { 50% { opacity: .25; } }
.mms {
  --bg: #05080e; --panel: #0b111b; --panel-2: #101826; --line: #1b2638; --line-2: #2b3c57;
  --fg: #e8f0fa; --muted: #8397b3; --accent: #38d6ff; --accent-2: #4a78ff; --accent-ink: #031018; --danger: #ff6178;
  --font-ui: "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: "Unbounded", "DM Sans", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  color-scheme: dark;
  position: relative; min-height: 100vh;
  background: var(--bg); color: var(--fg); font-family: var(--font-ui); font-size: 14px; line-height: 1.45;
  padding: 0 16px 40px; -webkit-font-smoothing: antialiased;
  &, & * { box-sizing: border-box; }
  &::before {
    content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(900px 500px at 15% -10%, rgba(56,214,255,.10), transparent 60%),
      radial-gradient(800px 500px at 100% 0%, rgba(74,120,255,.10), transparent 60%);
  }
  .wrap { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; }
  button, input, select, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  header.top { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20; margin-inline: -16px; padding: 12px 16px; background: rgba(5,8,14,.82); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
  header.top .wrap { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .mark { width: 38px; height: 38px; border-radius: 11px; flex: none; display: grid; place-items: center; background: linear-gradient(140deg, var(--accent-2), var(--accent)); font-family: var(--font-display); font-weight: 700; font-size: 17px; color: #fff; text-shadow: 0 0 12px rgba(255,255,255,.7); box-shadow: 0 6px 22px rgba(56,214,255,.28); }
  .brand h1 { margin: 0; font-family: var(--font-display); font-size: 15px; font-weight: 700; letter-spacing: .01em; white-space: nowrap; }
  .brand p { margin: 0; color: var(--muted); font-size: 12px; }
  .top-actions { display: flex; gap: 8px; align-items: center; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; border-radius: 12px; font-weight: 600; font-size: 13px; background: var(--panel-2); border: 1px solid var(--line-2); color: var(--fg); transition: border-color .15s, background .15s, transform .05s; text-decoration: none; white-space: nowrap; }
  .btn:hover { border-color: var(--accent); background: #142033; }
  .btn:active { transform: translateY(1px); }
  .btn[disabled] { opacity: .5; cursor: progress; }
  .btn.primary { background: linear-gradient(135deg, var(--accent-2), var(--accent)); border-color: transparent; color: var(--accent-ink); box-shadow: 0 8px 24px rgba(56,214,255,.22); }
  .btn.primary:hover { filter: brightness(1.08); }
  .btn.sm { padding: 7px 10px; font-size: 12px; border-radius: 10px; }
  .btn.danger:hover { border-color: var(--danger); color: var(--danger); }
  .btn svg { width: 16px; height: 16px; flex: none; }

  .app { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(340px, .8fr); gap: 20px; padding-top: 20px; align-items: start; }
  .stage-col { position: sticky; top: calc(env(safe-area-inset-top, 0px) + 74px); min-width: 0; display: flex; flex-direction: column; gap: 14px; }
  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; }
  .stage { padding: 14px; }
  .stage-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; color: var(--muted); font-size: 12px; }
  .stage-head .hint { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .stage-head svg { width: 15px; height: 15px; color: var(--accent); flex: none; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; background: rgba(56,214,255,.1); color: var(--accent); border: 1px solid rgba(56,214,255,.25); }
  .badge i { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: mms-blip 1.2s ease-in-out infinite; }
  .viewport { display: grid; place-items: center; border-radius: 14px; overflow: hidden; padding: 10px; background: conic-gradient(#0a101a 25%, #0d1522 0 50%, #0a101a 0 75%, #0d1522 0) 0 0 / 20px 20px; border: 1px solid var(--line); min-height: 220px; }
  .viewport:focus-visible { outline-offset: 0; }
  canvas.cv { display: block; max-width: 100%; max-height: min(64vh, 620px); width: auto; height: auto; border-radius: 6px; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; box-shadow: 0 18px 50px rgba(0,0,0,.55); }
  canvas.cv.dragging { cursor: grabbing; }
  .actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
  .actions .btn { padding-inline: 8px; }
  .exportbar { display: flex; flex-wrap: wrap; gap: 12px 18px; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
  .exportbar label.opt { display: flex; align-items: center; gap: 8px; }
  .exportbar .sel { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .progress { height: 6px; background: var(--panel-2); border-radius: 99px; overflow: hidden; margin-top: 10px; }
  .progress i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--accent-2), var(--accent)); transition: width .15s; }
  .note { display: flex; gap: 10px; padding: 12px 14px; font-size: 12px; color: var(--muted); }
  .note svg { width: 18px; height: 18px; color: var(--accent-2); flex: none; margin-top: 1px; }
  .note b { color: var(--fg); display: block; margin-bottom: 2px; }

  select, input[type=text], textarea { width: 100%; background: var(--bg); border: 1px solid var(--line-2); border-radius: 11px; padding: 9px 11px; color: var(--fg); }
  select { width: auto; padding: 6px 10px; font-size: 12px; }
  select.full { width: 100%; font-size: 13px; padding: 9px 11px; }
  textarea { resize: vertical; min-height: 66px; font-weight: 600; line-height: 1.3; }
  input[type=text]:focus, textarea:focus, select:focus { border-color: var(--accent); outline: none; }
  input[type=range] { width: 100%; accent-color: var(--accent); height: 22px; margin: 0; }
  input[type=color] { width: 34px; height: 34px; padding: 0; border: 0; background: none; border-radius: 9px; cursor: pointer; }
  input[type=checkbox] { width: 16px; height: 16px; accent-color: var(--accent); }
  .switch { position: relative; width: 38px; height: 22px; flex: none; }
  .switch input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; z-index: 1; width: 100%; height: 100%; }
  .switch span { position: absolute; inset: 0; border-radius: 99px; background: var(--line-2); transition: background .15s; }
  .switch span::after { content: ""; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; border-radius: 50%; background: #fff; transition: transform .15s; }
  .switch input:checked + span { background: var(--accent-2); }
  .switch input:checked + span::after { transform: translateX(16px); }
  .switch input:focus-visible + span { outline: 2px solid var(--accent); outline-offset: 2px; }

  .panel { min-width: 0; display: flex; flex-direction: column; }
  .tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 5px; border-bottom: 1px solid var(--line); }
  .tab { padding: 10px 6px; border: 0; background: transparent; color: var(--muted); font-weight: 600; font-size: 13px; border-radius: 12px; }
  .tab:hover { color: var(--fg); }
  .tab[aria-selected=true] { background: var(--panel-2); color: var(--fg); box-shadow: inset 0 0 0 1px var(--line-2); }

  /* template strip */
  .strip-wrap { border-bottom: 1px solid var(--line); padding: 10px 12px 8px; }
  .strip-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
  .strip-head .count { font-family: var(--font-mono); color: var(--accent); margin-left: 6px; letter-spacing: 0; }
  .strip-head input.strip-search { width: 110px; padding: 5px 9px; font-size: 12px; border-radius: 9px; }
  .strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; scroll-snap-type: x proximity; scrollbar-width: thin; scrollbar-color: var(--line-2) transparent; }
  .strip .tpl { flex: none; width: 104px; scroll-snap-align: start; }
  .strip .empty { grid-column: auto; }

  .tabpane { padding: 16px; display: flex; flex-direction: column; gap: 18px; }
  .field-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
  .lbl { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .lbl.nocase { text-transform: none; letter-spacing: 0; }
  .val { font-family: var(--font-mono); font-size: 12px; color: var(--accent); font-variant-numeric: tabular-nums; }
  .sliders { display: flex; flex-direction: column; gap: 12px; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .chip { padding: 6px 11px; border-radius: 10px; background: var(--panel-2); border: 1px solid var(--line-2); font-size: 12px; color: var(--muted); transition: all .12s; }
  .chip:hover { color: var(--fg); border-color: var(--accent); }
  .chip[aria-pressed=true] { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); font-weight: 700; }
  .layers { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
  .layer-chip { flex: none; max-width: 170px; display: flex; align-items: center; gap: 8px; padding: 7px 11px; border-radius: 10px; border: 1px solid var(--line-2); background: var(--panel-2); font-size: 12px; color: var(--muted); }
  .layer-chip b { font-family: var(--font-mono); color: var(--accent); font-weight: 500; }
  .layer-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .layer-chip[aria-pressed=true] { border-color: var(--accent); color: var(--fg); background: #112033; }
  .fontgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .fontbtn { padding: 10px 6px 8px; border-radius: 11px; background: var(--panel-2); border: 1px solid var(--line-2); display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 0; }
  .fontbtn .sample { font-size: 22px; line-height: 1.1; color: var(--fg); }
  .fontbtn small { font-size: 10px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .fontbtn:hover { border-color: var(--accent); }
  .fontbtn[aria-pressed=true] { border-color: var(--accent); background: #112033; box-shadow: 0 0 0 1px var(--accent) inset; }
  .stylegrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .stylegrid .chip { text-align: center; padding-inline: 4px; }
  .looks { display: flex; gap: 6px; flex-wrap: wrap; }
  .swatches { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
  .sw { width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--line-2); padding: 0; }
  .sw:hover { border-color: #fff; }
  .colorbox { display: flex; align-items: center; gap: 8px; background: var(--bg); border: 1px solid var(--line-2); border-radius: 11px; padding: 4px 10px 4px 5px; }
  .colorbox span { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; }
  .tpl { position: relative; padding: 0; border-radius: 12px; overflow: hidden; border: 2px solid var(--line-2); background: #000; aspect-ratio: 16 / 9; }
  .tpl canvas { width: 100%; height: 100%; display: block; }
  .tpl span { position: absolute; inset: auto 0 0 0; padding: 14px 6px 4px; font-size: 10px; font-weight: 700; text-align: left; color: #fff; background: linear-gradient(transparent, rgba(0,0,0,.85)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tpl:hover { border-color: var(--muted); }
  .tpl[aria-pressed=true] { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(56,214,255,.2); }
  .drop { border: 1.5px dashed var(--line-2); border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; background: var(--bg); transition: all .15s; }
  .drop.over { border-color: var(--accent); background: rgba(56,214,255,.07); }
  .drop svg { width: 26px; height: 26px; color: var(--accent); flex: none; }
  .drop p { margin: 0; color: var(--muted); font-size: 12px; }
  .drop p b { display: block; color: var(--fg); font-size: 13px; }
  .empty { color: var(--muted); font-size: 12px; padding: 10px 0; }
  .sep { height: 1px; background: var(--line); }
  .toggles { display: flex; flex-direction: column; gap: 10px; }
  .toggle { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: var(--muted); font-size: 13px; cursor: pointer; }
  .toggle:hover { color: var(--fg); }

  footer { margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between; }
  kbd { font-family: var(--font-mono); font-size: 11px; padding: 1px 6px; border-radius: 6px; border: 1px solid var(--line-2); background: var(--panel-2); color: var(--fg); }

  .overlay { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px; background: rgba(2,5,10,.78); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
  .sheet { width: min(720px, 100%); max-height: calc(100% - 8px); overflow: auto; background: var(--panel); border: 1px solid var(--line-2); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .sheet h2 { margin: 0; font-family: var(--font-display); font-size: 14px; }
  .sheet .pv { display: grid; place-items: center; border-radius: 12px; border: 1px solid var(--line); padding: 10px; background: conic-gradient(#0a101a 25%, #0d1522 0 50%, #0a101a 0 75%, #0d1522 0) 0 0 / 20px 20px; }
  .sheet .pv img { max-width: 100%; max-height: 52vh; display: block; border-radius: 6px; }
  .sheet .meta { color: var(--muted); font-size: 12px; font-family: var(--font-mono); }
  .sheet .meta.ui { font-family: var(--font-ui); }
  .toast { position: fixed; left: 50%; bottom: calc(env(safe-area-inset-bottom, 0px) + 22px); transform: translate(-50%, 20px); opacity: 0; pointer-events: none; z-index: 60; max-width: calc(100% - 32px); padding: 11px 16px; border-radius: 12px; background: #16233a; border: 1px solid var(--line-2); box-shadow: 0 12px 40px rgba(0,0,0,.5); font-size: 13px; font-weight: 600; transition: all .22s; }
  .toast.show { opacity: 1; transform: translate(-50%, 0); }

  @media (max-width: 980px) {
    .app { grid-template-columns: minmax(0, 1fr); }
    .stage-col { position: static; }
    .brand p { display: none; }
  }
  @media (max-width: 520px) {
    .actions { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .fontgrid { grid-template-columns: repeat(2, 1fr); }
    .stylegrid { grid-template-columns: repeat(3, 1fr); }
    .top-actions .btn span { display: none; }
  }
  @media (prefers-reduced-motion: reduce) { &, & * { animation: none !important; transition: none !important; } }
}
`;