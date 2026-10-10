import { DEFAULT_TEXT_POSITIONS, FONT_W, TEMPLATES, WATERMARK_ENABLED, WATERMARK_TEXT } from "../../data/memeTemplates.js";
const TEMPLATE_IMAGES = new Map();

/* ---------- canvas text engine (pure functions) ---------- */
export function newLayer(S, over) {
    const template = S.bg && TEMPLATES.find((t) => t.id === S.bg.id);
    const positions = template && template.textPositions;
    const position = (positions && positions[S.layers.length]) || DEFAULT_TEXT_POSITIONS[S.layers.length % DEFAULT_TEXT_POSITIONS.length];
    const L = { id: S.nextId++, text: "HELL YEAH", font: "Anton", size: template ? template.size ?? 14 : 14, color: "#ffffff", glow: "#06b6d4", strength: 80, style: "glow", align: template ? template.textAlignment : "left", x: position.x, y: position.y, rot: 0, opacity: 100, spacing: 0, allCaps: template ? template.allCaps : true, shrinkAbove: template ? template.shrinkAbove : true, highlightLast: null, fit: true, _b: null };
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
function drawStr(c, str, y, sp, stroke, align) {
    if (!str) return;
    c.textAlign = align;
    if (!sp) { stroke ? c.strokeText(str, 0, y) : c.fillText(str, 0, y); return; }
    const width = measure(c, str, sp);
    let x = align === "left" ? 0 : align === "right" ? -width : -width / 2;
    c.textAlign = "left";
    graphemes(str).forEach((ch) => { stroke ? c.strokeText(ch, x, y) : c.fillText(ch, x, y); x += c.measureText(ch).width + sp; });
}
function layout(c, L, W, H) {
    const base = L.size / 100 * H, raw = L.text.split("\n"), sp = L.spacing / 100;
    const lines = raw.map((s, i) => ({ str: L.allCaps ? s.toUpperCase() : s, size: (L.shrinkAbove && raw.length > 1 && i < raw.length - 1) ? base * .65 : base }));
    const wd = (l, size) => { c.font = fontStr(L, size); return measure(c, l.str, sp * size); };
    let f = 1;
    const align = L.align || "left";
    const availableWidth = align === "left" ? W * (1 - L.x) : align === "right" ? W * L.x : W * Math.min(1, 2 * Math.min(L.x, 1 - L.x));
    if (L.fit) { let mw = 0; lines.forEach((l) => { mw = Math.max(mw, wd(l, l.size)); }); if (mw > availableWidth * .92) f = availableWidth * .92 / mw; }
    let tot = 0, mxw = 0;
    lines.forEach((l) => { l.size *= f; l.w = wd(l, l.size); l.h = l.size * 1.12; tot += l.h; mxw = Math.max(mxw, l.w); });
    let y = -tot / 2; lines.forEach((l) => { l.y = y + l.h / 2; y += l.h; });
    return { lines, w: mxw, h: tot, sp };
}
function drawLine(c, L, str, y, size, sp, intensity, highlightLast) {
    const st = L.style, glow = L.glow, col = L.color;
    c.lineJoin = "round"; c.miterLimit = 2;
    const reset = () => { c.shadowBlur = 0; c.shadowOffsetX = 0; c.shadowOffsetY = 0; c.shadowColor = "rgba(0,0,0,0)"; };
    const fill = (color) => { c.fillStyle = color; drawStr(c, str, y, sp, false, L.align || "left"); };
    const stroke = (color, wd) => { c.strokeStyle = color; c.lineWidth = wd; drawStr(c, str, y, sp, true, L.align || "left"); };
    if (st === "glow") {
        c.shadowColor = glow; c.shadowOffsetX = 0; c.shadowOffsetY = 0;
        c.shadowBlur = intensity * size * .5; fill(col);
        c.shadowBlur = intensity * size * .28; fill(col);
        c.shadowBlur = intensity * size * .1; fill(col);
        reset(); stroke("rgba(0,0,0,.55)", size * .04);
    } else if (st === "neon") {
        c.shadowColor = glow; c.shadowBlur = intensity * size * .55; stroke(glow, size * .07);
        c.shadowBlur = intensity * size * .3; stroke(glow, size * .07);
        c.shadowBlur = intensity * size * .12; fill(col);
        reset(); fill(col);
    } else if (st === "classic") {
        c.shadowColor = glow; c.shadowBlur = intensity * size * .2; stroke("#000", size * .14);
        reset(); fill(col);
    } else if (st === "manga") {
        c.fillStyle = glow; c.save(); c.translate(size * .06, size * .06); drawStr(c, str, y, sp, false, L.align || "left"); c.restore();
        reset(); stroke("#000", size * (.1 + intensity * .08)); fill(col);
    } else if (st === "outline") {
        c.shadowColor = glow; c.shadowBlur = intensity * size * .4; stroke(col, size * .045);
        reset(); stroke(col, size * .045);
    } else if (st === "gradient") {
        const gr = c.createLinearGradient(0, y - size * .5, 0, y + size * .5);
        gr.addColorStop(0, col); gr.addColorStop(1, glow);
        c.shadowColor = glow; c.shadowBlur = intensity * size * .4; fill(gr);
        reset();
    } else if (st === "glitch") {
        const d = size * (.025 + intensity * .03);
        c.save(); c.globalAlpha *= .85; c.translate(-d, 0); fill("#ff2a6d"); c.restore();
        c.save(); c.globalAlpha *= .85; c.translate(d, 0); fill(glow); c.restore();
        c.shadowColor = glow; c.shadowBlur = intensity * size * .12; fill(col); reset();
    } else if (st === "plain") {
        fill(col);
    }
    reset();
    if (highlightLast && L.highlightLast) {
        const chars = graphemes(str);
        let wordEnd = -1;
        chars.forEach((char, index) => {
            if (/[\p{L}\p{N}]/u.test(char)) wordEnd = index;
        });
        if (wordEnd >= 0) {
            let wordStart = wordEnd;
            while (wordStart > 0 && /[\p{L}\p{N}]/u.test(chars[wordStart - 1])) wordStart--;
            const align = L.align || "left";
            let x = align === "left" ? 0 : align === "right" ? -measure(c, str, sp) : -measure(c, str, sp) / 2;
            for (let index = 0; index < wordStart; index++) {
                x += c.measureText(chars[index]).width + sp;
            }
            c.save();
            c.translate(x, 0);
            c.textAlign = "left";
            c.fillStyle = L.highlightLast;
            drawStr(c, chars.slice(wordStart, wordEnd + 1).join(""), y, sp, false, "left");
            c.restore();
        }
    }
}
function drawLayer(c, L, W, H, ui) {
    if (!L.text || !L.text.trim()) { if (ui) L._b = null; return; }
    const lay = layout(c, L, W, H), intensity = L.strength / 100;
    c.save();
    c.translate(L.x * W, L.y * H); c.rotate(L.rot * Math.PI / 180);
    c.globalAlpha = L.opacity / 100; c.textBaseline = "middle";
    lay.lines.forEach((l, index) => {
        c.font = fontStr(L, l.size);
        drawLine(c, L, l.str, l.y, l.size, lay.sp * l.size, intensity, index === lay.lines.length - 1);
    });
    c.restore();
    if (ui) {
        const align = L.align || "left";
        L._b = {
            cx: L.x * W + (align === "left" ? lay.w / 2 : align === "right" ? -lay.w / 2 : 0),
            cy: L.y * H,
            w: lay.w + lay.lines[0].size * .3,
            h: lay.h + lay.lines[0].size * .2,
            rot: L.rot,
        };
    }
}
function drawOverlay(c, W, H, S) {
    if (!S.showOverlay) return;
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
function drawWatermark(c, W, H) {
    if (!WATERMARK_ENABLED) return;
    const padding = Math.max(6, W * .018);
    const size = Math.max(9, W * .016);
    c.save();
    c.globalAlpha = .48;
    c.font = `600 ${size}px system-ui, sans-serif`;
    c.textAlign = "right";
    c.textBaseline = "bottom";
    c.shadowColor = "rgba(0,0,0,.8)";
    c.shadowBlur = size * .3;
    c.fillStyle = "#ffffff";
    c.fillText(WATERMARK_TEXT, W - padding, H - padding);
    c.restore();
}
export function renderScene(c, W, H, o, S, fin) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, W, H); c.drawImage(fin, 0, 0, W, H);
    S.layers.forEach((L) => drawLayer(c, L, W, H, o.ui));
    drawWatermark(c, W, H);
    if (o.ui) drawOverlay(c, W, H, S);
}
export function loadFont(n, cb) {
    if (n === "Impact" || typeof document === "undefined" || !document.fonts) return;
    document.fonts.load(FONT_W[n] + ' 48px "' + n + '"').then(cb, () => { });
}


export function loadTemplateImage(src) {
    if (!TEMPLATE_IMAGES.has(src)) {
        TEMPLATE_IMAGES.set(src, new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Template image failed to load"));
            image.src = src;
            if (image.complete && image.naturalWidth) resolve(image);
        }));
    }
    return TEMPLATE_IMAGES.get(src);
}