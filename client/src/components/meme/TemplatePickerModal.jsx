import React, { useEffect, useState } from "react";
import { Thumb } from "./EditorPrimitives.jsx";

export default function TemplatePickerModal({ templates, selectedId, onClose, onSelect }) {
    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();
    const visibleTemplates = templates.filter((template) =>
        !query || template.name.toLowerCase().includes(query) || template.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="template-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section className="template-modal" role="dialog" aria-modal="true" aria-labelledby="template-modal-title">
                <div className="template-modal-handle" aria-hidden="true"><span /></div>
                <header className="template-modal-header">
                    <div>
                        <h2 id="template-modal-title">All meme templates</h2>
                        <p>Choose a template to reset the text and style to its defaults.</p>
                    </div>
                    <button className="btn sm template-modal-close" type="button" onClick={onClose} aria-label="Close templates">
                        <span aria-hidden="true">×</span>
                    </button>
                </header>
                <div className="template-modal-content">
                    <input
                        className="template-modal-search"
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search all templates…"
                        aria-label="Search all templates"
                        autoFocus
                    />
                    <div className="template-modal-grid" role="list" aria-label="All templates">
                        {visibleTemplates.map((template) => (
                            <button
                                key={template.id}
                                className="template-modal-card"
                                type="button"
                                role="listitem"
                                aria-pressed={selectedId === template.id}
                                onClick={() => {
                                    onSelect(template);
                                    onClose();
                                }}
                            >
                                <Thumb t={template} />
                                <span>{template.name}</span>
                            </button>
                        ))}
                        {!visibleTemplates.length && <p className="template-modal-empty">No templates match “{search}”.</p>}
                    </div>
                </div>
            </section>
        </div>
    );
}
