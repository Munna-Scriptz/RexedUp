import React from "react";

/* ---------- small UI pieces ---------- */
export const Svg = ({ children, sw = 2 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
export const Slider = ({ id, label, val, unit = "", min, max, step, onChange, disabled }) => (
    <div>
        <div className="field-head"><label className="lbl" htmlFor={id}>{label}</label><span className="val">{val}{unit}</span></div>
        <input type="range" id={id} min={min} max={max} step={step} value={val} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
);
export function Thumb({ t }) {
    return <img src={t.image} alt="" />;
}

