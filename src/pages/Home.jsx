import React, { useEffect, useReducer, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { DEFAULT_TEXT_POSITIONS, FONTS, GLOWS, PHRASES, STYLES, TEMPLATES } from "../data/memeTemplates.js";
import { encodeGIF } from "../lib/meme/gifEncoder.js";
import { loadFont, loadTemplateImage, newLayer, renderScene } from "../lib/meme/canvasEngine.js";
import { Slider, Svg, Thumb } from "../components/meme/EditorPrimitives.jsx";
import TemplatePickerModal from "../components/meme/TemplatePickerModal.jsx";
import "../styles/memeEditor.css";
import Navbar from "../components/common/Navbar.jsx";

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
    const [positionTool, setPositionTool] = useState(false);
    const [pickedPosition, setPickedPosition] = useState(null);
    const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

    // Mutable engine state lives in a ref; React re-renders the controls via force().
    const R = useRef(null);
    if (!R.current) {
        const S = {
            layers: [], sel: null, nextId: 1,
            fx: { brightness: 0, contrast: 0, saturation: 0, blur: 0, dim: 0, vignette: 0 },
            bg: { kind: "tpl", id: "shadow", img: null },
            gifW: 480, dirty: false, guides: { x: false, y: false }, showOverlay: false,
        };
        const first = newLayer(S, { text: TEMPLATES[0].text, ...TEMPLATES[0].look });
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
        renderScene(r.ctx, cv.width, cv.height, { ui: true }, S, r.fin);
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
    const rebuildBase = async () => {
        let w, h;
        if (S.bg.kind === "img" && S.bg.img) {
            const im = S.bg.img, sc = Math.min(1, 1280 / Math.max(im.naturalWidth, im.naturalHeight));
            w = Math.max(2, Math.round(im.naturalWidth * sc)); h = Math.max(2, Math.round(im.naturalHeight * sc));
            r.base.width = w; r.base.height = h; r.base.getContext("2d").drawImage(im, 0, 0, w, h);
        } else {
            const t = TEMPLATES.find((x) => x.id === S.bg.id) || TEMPLATES[0];
            let image;
            try {
                image = await loadTemplateImage(t.image);
            } catch {
                toast("Template image could not be loaded.");
                return;
            }
            if (S.bg.kind !== "tpl" || S.bg.id !== t.id) return;
            const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
            w = Math.max(2, Math.round(image.naturalWidth * scale));
            h = Math.max(2, Math.round(image.naturalHeight * scale));
            r.base.width = w; r.base.height = h;
            r.base.getContext("2d").drawImage(image, 0, 0, w, h);
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
        renderScene(c.getContext("2d"), c.width, c.height, { ui: false }, S, r.fin);
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
            const n = 1, oc = document.createElement("canvas"); oc.width = tw; oc.height = th;
            const oc2 = oc.getContext("2d", { willReadFrequently: true }), frames = [];
            for (let i = 0; i < n; i++) {
                renderScene(oc2, tw, th, { ui: false }, S, r.fin);
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
        const l = newLayer(S, { text: "NEW TEXT", glow: c ? c.glow : "#06b6d4", font: c ? c.font : "Anton", style: c ? c.style : "glow" });
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
    const resetPosition = () => {
        const c = cur(); if (!c) return;
        const index = S.layers.indexOf(c);
        const template = TEMPLATES.find((t) => t.id === S.bg.id);
        const positions = template && template.textPositions;
        const position = (positions && positions[index]) || DEFAULT_TEXT_POSITIONS[index % DEFAULT_TEXT_POSITIONS.length];
        c.x = position.x; c.y = position.y; c.rot = 0;
        sync();
    };
    const copyPickedPosition = async () => {
        if (!pickedPosition) return;
        const snippet = `{ x: ${pickedPosition.x.toFixed(4)}, y: ${pickedPosition.y.toFixed(4)} }`;
        try {
            await navigator.clipboard.writeText(snippet);
            toast("Position copied");
        } catch {
            toast("Clipboard unavailable. Copy the position shown above.");
        }
    };
    const applyLook = (look) => { const c = cur(); if (!c) return; for (const k in look) c[k] = look[k]; loadFont(c.font, redraw); sync(); };

    /* ----- templates ----- */
    const pickTemplate = (t) => {
        S.bg = { kind: "tpl", id: t.id, img: null };
        const c = cur();
        if (c) {
            c.text = t.text;
            c.glow = "#06b6d4";
            for (const k in t.look) c[k] = t.look[k];
            c.allCaps = t.allCaps;
            c.shrinkAbove = t.shrinkAbove;
            c.align = t.textAlignment;
            c.size = t.size ?? 14;
            const position = t.textPositions ? t.textPositions[0] : DEFAULT_TEXT_POSITIONS[0];
            c.x = position.x; c.y = position.y;
            loadFont(c.font, redraw);
        }
        S.dirty = false;
        setPickedPosition(null);
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
        im.onload = () => { S.bg = { kind: "img", id: "custom", img: im }; rebuildBase(); force(); toast("Image loaded"); };
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
        e.preventDefault();
        if (positionTool) {
            const point = pt(e), layer = cur();
            const position = {
                x: Number(Math.max(0, Math.min(1, point.x)).toFixed(4)),
                y: Number(Math.max(0, Math.min(1, point.y)).toFixed(4)),
            };
            if (layer) {
                layer.x = position.x; layer.y = position.y; S.dirty = true;
                const index = S.layers.indexOf(layer);
                console.info(`[Meme position] ${S.bg.id} textPositions[${index}]`, position);
                sync();
            }
            setPickedPosition(position);
            return;
        }
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) { }
        S.showOverlay = true;
        redraw();
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
        if (n === 0) { r.dragging = false; e.currentTarget.classList.remove("dragging"); S.guides = { x: false, y: false }; S.showOverlay = false; redraw(); }
        else if (n === 1) { r.lastP = r.ptrs[Object.keys(r.ptrs)[0]]; r.dragging = true; }
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
            <Navbar surprise={surprise}/>

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
                            </div>
                            <div className="viewport" aria-label="Meme canvas">
                                <canvas ref={cvRef} className={"cv" + (positionTool ? " position-picking" : "")} width={1280} height={720}
                                    onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
                            </div>
                            <div className="position-console hidden lg:block">
                                <div className="row">
                                    <button className="btn sm" type="button" aria-pressed={positionTool}
                                        onClick={() => { setPositionTool((active) => !active); setPickedPosition(null); }}>
                                        {positionTool ? "Stop position helper" : "Locate text position"}
                                    </button>
                                    {positionTool && <span>Click the canvas to place the selected layer and capture its coordinates.</span>}
                                </div>
                                {pickedPosition && (
                                    <div className="position-readout" aria-live="polite">
                                        <code>{`textPositions[${Math.max(0, S.layers.indexOf(L))}]: { x: ${pickedPosition.x.toFixed(4)}, y: ${pickedPosition.y.toFixed(4)} }`}</code>
                                        <button className="btn sm" type="button" onClick={copyPickedPosition}>Copy position</button>
                                    </div>
                                )}
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
                                <button className="btn" type="button" onClick={resetPosition}>
                                    <Svg><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></Svg>Reset position
                                </button>
                            </div>
                            {prog !== null && <div className="progress"><i style={{ width: prog + "%" }} /></div>}
                            <div className="exportbar">
                                <div className="sel">
                                    <label htmlFor="gifWidth">GIF width</label>
                                    <select id="gifWidth" value={String(S.gifW)} onChange={(e) => { S.gifW = Number(e.target.value); force(); }}>
                                        <option value="320">320 px</option><option value="480">480 px</option><option value="640">640 px</option>
                                    </select>
                                    <a className="btn sm" href="https://giphy.com/upload" target="_blank" rel="noreferrer noopener">Upload to GIPHY</a>
                                </div>
                            </div>
                        </div>
                        <div className="card note !hidden sm:!inline-flex">
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
                            <button className="template-picker-trigger" type="button" onClick={() => setTemplatePickerOpen(true)}>
                                See all templates <span aria-hidden="true">→</span>
                            </button>
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
                                    <textarea id="txt" ref={txtRef} rows={3} placeholder="Type your meme text" disabled={dis}
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
                                    <div className="field-head"><span className="lbl">Text alignment</span></div>
                                    <div className="row">
                                        {["left", "center", "right"].map((align) => (
                                            <button key={align} className="chip" type="button" aria-pressed={!!L && (L.align || "left") === align}
                                                onClick={() => setL("align", align)}>{align[0].toUpperCase() + align.slice(1)}</button>
                                        ))}
                                    </div>
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
                                    {[["allCaps", "All caps"], ["shrinkAbove", "Shrink lines above the last one"], ["fit", "Auto-fit to image width"]].map(([k, label]) => (
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

                <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-400">
                    <span>Rendered locally in your browser.</span>
                    <a
                        className="inline-flex items-center gap-1.5 font-medium text-slate-300 transition hover:text-cyan-300"
                        href="https://github.com/Munna-Scriptz"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        <span>Made by</span>
                        <span className="font-semibold text-slate-100">Munna-Scriptz</span>
                        <FaGithub size={14} aria-hidden="true" />
                    </a>
                </footer>
            </main>

            {templatePickerOpen && (
                <TemplatePickerModal
                    templates={TEMPLATES}
                    selectedId={S.bg.kind === "tpl" ? S.bg.id : null}
                    onClose={() => setTemplatePickerOpen(false)}
                    onSelect={pickTemplate}
                />
            )}

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
