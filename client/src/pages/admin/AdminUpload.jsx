import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { CloudUpload, ImagePlus, Plus, Upload, X } from "lucide-react";
import { FONTS, GLOWS, STYLES } from "../../data/memeTemplates";
import { loadFont, newLayer, renderScene } from "../../lib/meme/canvasEngine";
import { useUploadMemeTemplateMutation } from "../../api";
import "../../styles/memeEditor.css";

const AdminUpload = () => {
    const [, rerender] = useReducer((value) => value + 1, 0);
    const canvasRef = useRef(null);
    const fileRef = useRef(null);
    const engine = useRef(null);
    const [fileName, setFileName] = useState("");
    const [name, setName] = useState("");
    const [tags, setTags] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [editorTab, setEditorTab] = useState("text");
    const [upload, { isLoading }] = useUploadMemeTemplateMutation();

    if (!engine.current) {
        const state = {
            layers: [],
            sel: null,
            nextId: 1,
            guides: { x: false, y: false },
            showOverlay: false,
            bg: { kind: "img", id: "admin-upload", img: null },
        };
        engine.current = {
            state,
            base: document.createElement("canvas"),
            final: document.createElement("canvas"),
            context: null,
            hasImage: false,
            pointer: null,
            raf: 0,
        };
    }
    const editor = engine.current;
    const state = editor.state;
    const selectedLayer = state.layers.find((layer) => layer.id === state.sel) || null;

    const draw = useCallback(() => {
        cancelAnimationFrame(editor.raf);
        editor.raf = requestAnimationFrame(() => {
            const canvas = canvasRef.current;
            if (!canvas || !editor.context || !editor.hasImage) return;
            renderScene(editor.context, canvas.width, canvas.height, { ui: true }, state, editor.final);
        });
    }, [editor, state]);

    const refresh = () => {
        rerender();
        draw();
    };

    useEffect(() => {
        editor.context = canvasRef.current?.getContext("2d") || null;
        const onResize = () => draw();
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(editor.raf);
            window.removeEventListener("resize", onResize);
            if (state.bg.img?.src?.startsWith("blob:")) URL.revokeObjectURL(state.bg.img.src);
        };
    }, [draw, editor]);

    const loadImage = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Choose a valid image file.");
            return;
        }
        setError("");
        setSuccess("");
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
            const width = Math.max(2, Math.round(image.naturalWidth * scale));
            const height = Math.max(2, Math.round(image.naturalHeight * scale));
            editor.base.width = width;
            editor.base.height = height;
            editor.final.width = width;
            editor.final.height = height;
            editor.base.getContext("2d").drawImage(image, 0, 0, width, height);
            editor.final.getContext("2d").drawImage(editor.base, 0, 0);
            state.bg = { kind: "img", id: "admin-upload", img: image };
            editor.hasImage = true;
            setFileName(file.name);
            refresh();
            URL.revokeObjectURL(objectUrl);
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            setError("Could not open this image. Try a PNG, JPG, or WebP file.");
        };
        image.src = objectUrl;
    };

    const setLayer = (key, value) => {
        if (!selectedLayer) return;
        selectedLayer[key] = value;
        if (key === "font") loadFont(value, draw);
        refresh();
    };

    const addTextLayer = () => {
        if (!editor.hasImage) return;
        const layer = newLayer(state, {
            text: "YOUR TEXT",
            font: "Oswald",
            style: "plain",
            color: "#ffffff",
            glow: "#06b6d4",
            strength: 80,
            size: 12,
            align: "center",
            x: 0.5,
            y: 0.5,
            allCaps: true,
        });
        state.layers.push(layer);
        state.sel = layer.id;
        loadFont(layer.font, draw);
        refresh();
    };

    const removeLayer = (layerId) => {
        state.layers = state.layers.filter((layer) => layer.id !== layerId);
        if (state.sel === layerId) state.sel = state.layers.at(-1)?.id ?? null;
        refresh();
    };

    const pointerPosition = (event) => {
        const bounds = canvasRef.current.getBoundingClientRect();
        return {
            x: (event.clientX - bounds.left) / bounds.width,
            y: (event.clientY - bounds.top) / bounds.height,
            clientX: event.clientX,
            clientY: event.clientY,
        };
    };

    const handlePointerDown = (event) => {
        if (!editor.hasImage) return;
        event.preventDefault();
        const point = pointerPosition(event);
        const canvas = canvasRef.current;
        const px = point.x * canvas.width;
        const py = point.y * canvas.height;
        const hitLayer = [...state.layers].reverse().find((layer) => {
            const bounds = layer._b;
            if (!bounds) return false;
            const angle = -bounds.rot * Math.PI / 180;
            const dx = px - bounds.cx;
            const dy = py - bounds.cy;
            const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
            const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
            return Math.abs(localX) <= bounds.w / 2 + canvas.width * 0.015 &&
                Math.abs(localY) <= bounds.h / 2 + canvas.width * 0.015;
        });
        if (hitLayer) state.sel = hitLayer.id;
        editor.pointer = { id: event.pointerId, point };
        state.showOverlay = true;
        canvas.setPointerCapture(event.pointerId);
        refresh();
    };

    const handlePointerMove = (event) => {
        if (!editor.pointer || editor.pointer.id !== event.pointerId) return;
        const point = pointerPosition(event);
        const layer = state.layers.find((item) => item.id === state.sel);
        if (layer) {
            layer.x = Math.max(0, Math.min(1, layer.x + point.x - editor.pointer.point.x));
            layer.y = Math.max(0, Math.min(1, layer.y + point.y - editor.pointer.point.y));
        }
        editor.pointer.point = point;
        draw();
    };

    const handlePointerUp = (event) => {
        if (editor.pointer?.id !== event.pointerId) return;
        editor.pointer = null;
        state.showOverlay = false;
        refresh();
    };

    const uploadTemplate = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (!editor.hasImage) {
            setError("Choose a meme image before uploading.");
            return;
        }
        if (!name.trim()) {
            setError("Enter a name for your meme.");
            return;
        }
        if (!state.layers.length) {
            setError("Add at least one text layer to your meme.");
            return;
        }

        const firstLayer = state.layers[0];
        const template = {
            name: name.trim(),
            tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
            imageDataUrl: editor.base.toDataURL("image/jpeg", 0.9),
            text: firstLayer.text,
            texts: state.layers.map(({ id, _b, ...layer }) => layer),
            look: {
                style: firstLayer.style,
                glow: firstLayer.glow,
                color: firstLayer.color,
                font: firstLayer.font,
                strength: firstLayer.strength,
            },
            size: firstLayer.size,
            textPositions: state.layers.map(({ x, y }) => ({ x, y })),
            allCaps: firstLayer.allCaps,
            shrinkAbove: firstLayer.shrinkAbove,
            textAlignment: firstLayer.align || "center",
        };

        try {
            await upload(template).unwrap();
            setSuccess("Meme uploaded. It is now available in the template library.");
            setName("");
            setTags("");
        } catch (requestError) {
            setError(requestError?.data?.message || requestError?.data?.error || requestError?.error || "Upload failed. Please try again.");
        }
    };

    return (
        <div className="mms admin-uploader">
            <main className="admin-uploader-wrap">
                <header className="items-center justify-between pt-4 hidden lg:flex">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Upload a meme</h1>
                        <p className="mt-2 text-sm text-slate-400">Choose your image, add text, drag it into place, and upload it to your library.</p>
                    </div>
                    <span className="admin-uploader-step"><ImagePlus size={16} /> Build a template</span>
                </header>

                <form className="admin-uploader-grid" onSubmit={uploadTemplate}>
                    <section className="admin-uploader-stage">
                        <div className="card stage">
                            <div className="stage-head">
                                <div className="hint">
                                    <ImagePlus />
                                    <span>{editor.hasImage ? "Drag text directly on the image to position it." : "Start by choosing the image for your meme."}</span>
                                </div>
                                {editor.hasImage && (
                                    <button type="button" className="btn sm" onClick={() => fileRef.current?.click()}>
                                        <ImagePlus /> Change image
                                    </button>
                                )}
                            </div>
                            <div
                                className={`admin-canvas-wrap${isDraggingFile ? " is-over" : ""}${editor.hasImage ? " has-image" : ""}`}
                                onDragOver={(event) => { event.preventDefault(); setIsDraggingFile(true); }}
                                onDragLeave={() => setIsDraggingFile(false)}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    setIsDraggingFile(false);
                                    loadImage(event.dataTransfer.files?.[0]);
                                }}
                            >
                                <canvas
                                    ref={canvasRef}
                                    className="admin-meme-canvas"
                                    width={960}
                                    height={600}
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerUp}
                                />
                                {!editor.hasImage && (
                                    <div className="admin-empty-canvas">
                                        <span><CloudUpload size={26} /></span>
                                        <b>Your canvas is empty</b>
                                        <p>Choose an image to start building your meme.</p>
                                        <button type="button" className="btn primary" onClick={() => fileRef.current?.click()}>
                                            <ImagePlus size={16} /> Choose image
                                        </button>
                                        <small>PNG, JPG, or WebP</small>
                                    </div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => {
                                loadImage(event.target.files?.[0]);
                                event.target.value = "";
                            }} />
                            {fileName && <p className="admin-file-name"><ImagePlus size={14} /> {fileName}</p>}
                            {editor.hasImage && (
                                <div className="admin-canvas-footer">
                                    <span>Drag text on the canvas to place it</span>
                                    <span>{state.layers.length} text {state.layers.length === 1 ? "layer" : "layers"}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="card admin-uploader-panel">
                        <div className="admin-panel-heading">
                            <div>
                                <h2>Template details</h2>
                                <p>Name it, add text and customize the look.</p>
                            </div>
                        </div>
                        <div className="admin-template-fields">
                            <label className="admin-editor-label admin-meta-label">
                                <span className="admin-meta-title">Meme name</span>
                                <input
                                    required
                                    maxLength={100}
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="e.g. Shadow Domain"
                                    className="w-full rounded-lg border border-gray-700 bg-[#05080E] px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
                                />
                            </label>

                            <label className="admin-editor-label admin-meta-label">
                                <span className="admin-meta-title">
                                    Tags <small>· optional, comma separated</small>
                                </span>
                                <input
                                    value={tags}
                                    onChange={(event) => setTags(event.target.value)}
                                    placeholder="anime, jjk, reaction"
                                    className="w-full rounded-lg border border-gray-700 bg-[#05080E] px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
                                />
                            </label>
                        </div>

                        <div className="admin-layer-section">
                            <div className="field-head">
                                <span className="lbl">Text layers</span>
                                <button type="button" disabled={!editor.hasImage} className="btn sm" onClick={addTextLayer}><Plus /> Add text</button>
                            </div>
                            {!state.layers.length ? (
                                <p className="admin-no-layers">Choose an image, then add a text layer to start.</p>
                            ) : (
                                <div className="admin-layer-list">
                                    {state.layers.map((layer, index) => (
                                        <div key={layer.id} className={`admin-layer-row${state.sel === layer.id ? " selected" : ""}`}>
                                            <button type="button" onClick={() => { state.sel = layer.id; refresh(); }} title={`Select text layer ${index + 1}`} className="admin-layer-select">
                                                <span>{index + 1}</span>
                                                <b>{layer.text.replace(/\n/g, " ") || "Empty text"}</b>
                                            </button>
                                            <button type="button" onClick={() => removeLayer(layer.id)} aria-label={`Delete text layer ${index + 1}`} className="admin-layer-remove"><X size={15} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedLayer && (
                            <div className="admin-editor">
                                <div className="admin-editor-tabs" role="tablist" aria-label="Text controls">
                                    {["text", "style"].map((tab) => (
                                        <button
                                            key={tab}
                                            id={`admin-editor-tab-${tab}`}
                                            type="button"
                                            role="tab"
                                            aria-selected={editorTab === tab}
                                            aria-controls={`admin-editor-panel-${tab}`}
                                            onClick={() => setEditorTab(tab)}
                                        >
                                            {tab === "text" ? "Text" : "Style"}
                                        </button>
                                    ))}
                                </div>
                                {editorTab === "text" ? (
                                    <div id="admin-editor-panel-text" role="tabpanel" aria-labelledby="admin-editor-tab-text" className="admin-layer-controls">
                                        <label className="admin-editor-label">
                                            Text content
                                            <textarea rows={3} value={selectedLayer.text} onChange={(event) => setLayer("text", event.target.value)} placeholder="Type your meme text" />
                                        </label>
                                        <div>
                                            <div className="field-head"><label className="lbl" htmlFor="admin-layer-size">Text size</label><span className="val">{selectedLayer.size}%</span></div>
                                            <input id="admin-layer-size" type="range" min="3" max="40" step="0.5" value={selectedLayer.size} onChange={(event) => setLayer("size", Number(event.target.value))} />
                                        </div>
                                        <div>
                                            <div className="field-head"><label className="lbl" htmlFor="admin-layer-rotation">Rotation</label><span className="val">{selectedLayer.rot}°</span></div>
                                            <input id="admin-layer-rotation" type="range" min="-180" max="180" step="1" value={selectedLayer.rot} onChange={(event) => setLayer("rot", Number(event.target.value))} />
                                        </div>
                                        <div>
                                            <div className="field-head"><label className="lbl" htmlFor="admin-layer-opacity">Opacity</label><span className="val">{selectedLayer.opacity}%</span></div>
                                            <input id="admin-layer-opacity" type="range" min="5" max="100" step="1" value={selectedLayer.opacity} onChange={(event) => setLayer("opacity", Number(event.target.value))} />
                                        </div>
                                        <div>
                                            <span className="lbl">Text alignment</span>
                                            <div className="admin-align-controls">
                                                {["left", "center", "right"].map((alignment) => (
                                                    <button key={alignment} type="button" aria-pressed={selectedLayer.align === alignment} onClick={() => setLayer("align", alignment)}>{alignment}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="admin-toggle-row">
                                            <label>All caps<input type="checkbox" checked={!!selectedLayer.allCaps} onChange={(event) => setLayer("allCaps", event.target.checked)} /></label>
                                            <label>Shrink lines above the last one<input type="checkbox" checked={!!selectedLayer.shrinkAbove} onChange={(event) => setLayer("shrinkAbove", event.target.checked)} /></label>
                                            <label>Auto-fit to image width<input type="checkbox" checked={!!selectedLayer.fit} onChange={(event) => setLayer("fit", event.target.checked)} /></label>
                                        </div>
                                    </div>
                                ) : (
                                    <div id="admin-editor-panel-style" role="tabpanel" aria-labelledby="admin-editor-tab-style" className="admin-layer-controls">
                                        <div>
                                            <div className="field-head"><span className="lbl">Text effects</span></div>
                                            <div className="admin-style-grid">
                                                {STYLES.map(([value, label]) => (
                                                    <button key={value} type="button" className={`admin-style-choice effect-${value}`} aria-pressed={selectedLayer.style === value} onClick={() => setLayer("style", value)}>
                                                        <span style={{ fontFamily: `'${selectedLayer.font}', Impact, sans-serif`, color: selectedLayer.color, textShadow: value === "glow" || value === "neon" ? `0 0 9px ${selectedLayer.glow}` : value === "classic" || value === "manga" ? "2px 2px 0 #000" : "none" }}>Aa</span>
                                                        <small>{label}</small>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="field-head"><span className="lbl">Fonts</span></div>
                                            <div className="admin-font-grid">
                                                {FONTS.map(([font, weight]) => (
                                                    <button key={font} type="button" aria-pressed={selectedLayer.font === font} onClick={() => setLayer("font", font)}>
                                                        <span style={{ fontFamily: `'${font}', Impact, sans-serif`, fontWeight: weight }}>Aa</span>
                                                        <small>{font}</small>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {/* Text Color */}
                                            <label className="text-sm">
                                                <div className="field-head"><span className="lbl">Text colors</span></div>
                                                <div className="flex items-center gap-2 focus-within:border-blue-500">
                                                    <input
                                                        type="color"
                                                        value={/^#[0-9A-Fa-f]{6}$/.test(selectedLayer.color)
                                                            ? selectedLayer.color
                                                            : "#ffffff"}
                                                        onChange={(event) =>
                                                            setLayer("color", event.target.value.toUpperCase())
                                                        }
                                                        className="h-9 w-10 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                                                        aria-label="Choose text color"
                                                    />

                                                    <input
                                                        type="text"
                                                        value={selectedLayer.color}
                                                        onChange={(event) => {
                                                            const value = event.target.value.toUpperCase();
                                                            if (/^#?[0-9A-F]{0,6}$/.test(value)) {
                                                                setLayer(
                                                                    "color",
                                                                    value && !value.startsWith("#")
                                                                        ? `#${value}`
                                                                        : value
                                                                );
                                                            }
                                                        }}
                                                        placeholder="#FFFFFF"
                                                        maxLength={7}
                                                        className="min-w-0 flex-1 bg-transparent font-mono text-sm uppercase text-gray-900 outline-none placeholder:text-gray-400"
                                                        aria-label="Text color HEX code"
                                                    />
                                                </div>
                                            </label>

                                            {/* Glow Color */}
                                            <label className="text-sm font-medium text-gray-700 ">
                                                <div className="field-head"><span className="lbl">Glow colors</span></div>

                                                <div className="flex items-center gap-2 focus-within:border-blue-500">
                                                    <input
                                                        type="color"
                                                        value={/^#[0-9A-Fa-f]{6}$/.test(selectedLayer.glow)
                                                            ? selectedLayer.glow
                                                            : "#000000"}
                                                        onChange={(event) =>
                                                            setLayer("glow", event.target.value.toUpperCase())
                                                        }
                                                        className="h-9 w-10 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                                                        aria-label="Choose glow color"
                                                    />

                                                    <input
                                                        type="text"
                                                        value={selectedLayer.glow}
                                                        onChange={(event) => {
                                                            const value = event.target.value.toUpperCase();
                                                            if (/^#?[0-9A-F]{0,6}$/.test(value)) {
                                                                setLayer(
                                                                    "glow",
                                                                    value && !value.startsWith("#")
                                                                        ? `#${value}`
                                                                        : value
                                                                );
                                                            }
                                                        }}
                                                        placeholder="#000000"
                                                        maxLength={7}
                                                        className="min-w-0 flex-1 bg-transparent font-mono text-sm uppercase text-gray-900 outline-none placeholder:text-gray-400"
                                                        aria-label="Glow color HEX code"
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                        <div>
                                            <div className="field-head"><span className="lbl">Glow colors</span></div>
                                            <div className="admin-glow-swatches" aria-label="Glow color swatches">
                                                {GLOWS.map((color) => <button key={color} type="button" aria-label={`Set glow color ${color}`} style={{ background: color }} onClick={() => setLayer("glow", color)} />)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="admin-upload-actions">
                            {error && <p className="admin-upload-feedback error" role="alert">{error}</p>}
                            {success && <p className="admin-upload-feedback success" role="status">{success}</p>}
                            <button type="submit" disabled={isLoading || !editor.hasImage || !state.layers.length} className="btn primary admin-submit-button">
                                <Upload size={16} /> {isLoading ? "Uploading meme…" : "Upload meme"}
                            </button>
                        </div>
                    </aside>
                </form>
            </main>
        </div>
    );
};

export default AdminUpload;
