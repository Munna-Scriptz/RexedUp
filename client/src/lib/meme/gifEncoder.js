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

export async function encodeGIF(frames, w, h, delayCs, onProgress) {
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

