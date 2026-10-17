import { FONTS, GLOWS, STYLES } from "../../data/memeTemplates";
import { Slider } from "./EditorPrimitives";

export default function TextAppearanceControls({ layer, onChange, onFontChange, idPrefix }) {
    const disabled = !layer;
    const value = (key, fallback) => layer?.[key] ?? fallback;
    const colorControl = (key, label, fallback) => (
        <div key={key}>
            <div className="field-head">
                <label className="lbl" htmlFor={`${idPrefix}-${key}`}>{label}</label>
            </div>
            <div className="colorbox">
                <input
                    id={`${idPrefix}-${key}`}
                    type="color"
                    value={value(key, fallback)}
                    disabled={disabled}
                    onChange={(event) => onChange(key, event.target.value)}
                />
                <span>{value(key, fallback)}</span>
            </div>
        </div>
    );

    return (
        <div className="text-appearance-controls">
            <section>
                <div className="field-head"><span className="lbl">Text effects</span></div>
                <div className="meme-style-grid">
                    {STYLES.map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            className={`meme-style-choice effect-${id}`}
                            aria-pressed={!!layer && layer.style === id}
                            disabled={disabled}
                            onClick={() => onChange("style", id)}
                        >
                            <span style={{
                                fontFamily: `'${value("font", "Anton")}', Impact, sans-serif`,
                                color: value("color", "#ffffff"),
                                textShadow: id === "glow" || id === "neon"
                                    ? `0 0 9px ${value("glow", "#06b6d4")}`
                                    : id === "classic" || id === "manga" ? "2px 2px 0 #000" : "none",
                            }}>Aa</span>
                            <small>{label}</small>
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <div className="field-head"><span className="lbl">Font</span></div>
                <div className="meme-font-grid">
                    {FONTS.map(([font, weight]) => (
                        <button
                            key={font}
                            type="button"
                            aria-pressed={!!layer && layer.font === font}
                            disabled={disabled}
                            onClick={() => onFontChange(font)}
                        >
                            <span style={{ fontFamily: `'${font}', Impact, sans-serif`, fontWeight: weight }}>Aa</span>
                            <small>{font}</small>
                        </button>
                    ))}
                </div>
            </section>

            <div className="meme-color-grid">
                {colorControl("color", "Text color", "#ffffff")}
                {colorControl("glow", "Glow color", "#06b6d4")}
                {colorControl("strokeColor", "Stroke color", "#000000")}
            </div>

            <section>
                <div className="field-head"><span className="lbl">Glow swatches</span></div>
                <div className="swatches">
                    {GLOWS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className="sw"
                            style={{ background: color }}
                            aria-label={`Set glow color to ${color}`}
                            disabled={disabled}
                            onClick={() => onChange("glow", color)}
                        />
                    ))}
                </div>
            </section>

            <Slider
                id={`${idPrefix}-stroke-width-style`}
                label="Stroke width"
                val={value("strokeWidth", 0)}
                unit="%"
                min={0}
                max={20}
                step={0.5}
                disabled={disabled}
                onChange={(next) => onChange("strokeWidth", next)}
            />
            <Slider
                id={`${idPrefix}-stroke-opacity`}
                label="Stroke opacity"
                val={value("strokeOpacity", 0)}
                unit="%"
                min={0}
                max={100}
                step={1}
                disabled={disabled}
                onChange={(next) => onChange("strokeOpacity", next)}
            />
            <Slider
                id={`${idPrefix}-glow-strength`}
                label="Glow intensity"
                val={value("strength", 80)}
                unit="%"
                min={0}
                max={100}
                step={1}
                disabled={disabled}
                onChange={(next) => onChange("strength", next)}
            />
        </div>
    );
}
