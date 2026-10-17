import React, { useEffect, useState } from "react";
import { Thumb } from "./EditorPrimitives.jsx";
import { useGetMemeTemplatesQuery } from "../../api";
import { LoaderCircle } from "lucide-react";

export default function TemplatePickerModal({ templates, selectedId, onClose, onSelect }) {
    const [search, setSearch] = useState("");
    const { data, isLoading, isError } = useGetMemeTemplatesQuery();
    const databaseTemplates = Array.isArray(data?.data)
        ? data.data.map((template) => ({
            ...template,
            id: template._id || template.id,
            texts: template.texts?.length ? template.texts : [template.text || ""],
            look: template.look || {},
            tags: Array.isArray(template.tags) ? template.tags : [],
        }))
        : [];
    const allTemplates = [...templates, ...databaseTemplates];
    const query = search.trim().toLowerCase();
    const visibleTemplates = allTemplates.filter((template) =>
        !query || template.name.toLowerCase().includes(query) || template.tags?.some((tag) => tag.toLowerCase().includes(query))
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
                    />
                    {isError && <p className="template-modal-status error" role="alert">Saved templates could not be loaded. Built-in templates are still available.</p>}
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
                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 py-3 text-sm text-text-muted">
                            <LoaderCircle size={16} className="animate-spin" />
                            <span>Loading saved templates...</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
