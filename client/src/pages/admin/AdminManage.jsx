import { useMemo, useState } from "react";
import { ChevronDown, MoreHorizontal, Pencil, Search, Trash2, X } from "lucide-react";
import { TEMPLATES } from "../../data/memeTemplates";
import { useDeleteMemeTemplateMutation, useGetMemeTemplatesQuery, useUpdateMemeTemplateMutation } from "../../api";

const EditMemeDialog = ({ meme, onClose, onSave, isSaving }) => {
    const [name, setName] = useState(meme.name);
    const [tags, setTags] = useState(meme.tags.join(", "));

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            id: meme._id,
            name: name.trim(),
            tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <form onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="edit-template-title" className="w-full max-w-lg rounded-2xl border border-[#2b3c57] bg-[#0b111b] p-6 shadow-2xl">
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <h2 id="edit-template-title" className="text-lg font-semibold text-slate-100">Edit meme</h2>
                        <p className="mt-1 text-sm text-slate-400">Update the title and searchable tags.</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close edit dialog" className="rounded-lg p-1.5 text-slate-400 hover:bg-[#101826]"><X size={19} /></button>
                </div>
                <label className="block text-sm font-medium text-slate-300">
                    Meme title
                    <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#2b3c57] bg-[#070b12] px-3.5 py-3 text-slate-100 outline-none focus:border-cyan-500" />
                </label>
                <label className="mt-4 block text-sm font-medium text-slate-300">
                    Tags <span className="font-normal text-slate-500">(comma separated)</span>
                    <input value={tags} onChange={(event) => setTags(event.target.value)} className="mt-2 w-full rounded-xl border border-[#2b3c57] bg-[#070b12] px-3.5 py-3 text-slate-100 outline-none focus:border-cyan-500" />
                </label>
                <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="rounded-xl border border-[#2b3c57] px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-[#101826]">Cancel</button>
                    <button type="submit" disabled={isSaving} className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-[#031018] hover:bg-cyan-400 disabled:opacity-50">{isSaving ? "Saving…" : "Save changes"}</button>
                </div>
            </form>
        </div>
    );
};

const AdminManage = () => {
    const { data, isLoading, isError } = useGetMemeTemplatesQuery();
    const [updateMeme, { isLoading: isSaving }] = useUpdateMemeTemplateMutation();
    const [deleteMeme] = useDeleteMemeTemplateMutation();
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("newest");
    const [openMenu, setOpenMenu] = useState("");
    const [editing, setEditing] = useState(null);
    const [actionError, setActionError] = useState("");
    const uploaded = Array.isArray(data?.data) ? data.data : [];
    const memes = useMemo(() => [...TEMPLATES, ...uploaded], [uploaded]);
    const visibleMemes = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const filtered = memes.filter((meme) =>
            meme.name.toLowerCase().includes(normalizedQuery) ||
            meme.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        );
        return filtered.sort((a, b) => {
            const createdA = a.createdAt ? new Date(a.createdAt).getTime() : -1;
            const createdB = b.createdAt ? new Date(b.createdAt).getTime() : -1;
            return sort === "oldest" ? createdA - createdB : createdB - createdA;
        });
    }, [memes, query, sort]);

    const saveMeme = async (updates) => {
        setActionError("");
        try {
            await updateMeme(updates).unwrap();
            setEditing(null);
        } catch (error) {
            setActionError(error?.data?.message || "Could not update this meme.");
        }
    };

    const removeMeme = async (meme) => {
        if (!window.confirm(`Delete "${meme.name}" permanently?`)) return;
        setActionError("");
        setOpenMenu("");
        try {
            await deleteMeme(meme._id).unwrap();
        } catch (error) {
            setActionError(error?.data?.message || "Could not delete this meme.");
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Content</p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100">Manage memes</h1>
                    <p className="mt-2 text-sm text-slate-400">Search and organize the templates available in the editor.</p>
                </div>
                <span className="w-fit rounded-full border border-[#2b3c57] bg-[#101826] px-3.5 py-2 text-sm text-slate-300">{memes.length} memes</span>
            </header>
            <section className="rounded-2xl border border-[#1b2638] bg-[#0b111b] p-4 sm:p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex-1">
                        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search memes or tags…" aria-label="Search memes or tags" className="w-full rounded-xl border border-[#2b3c57] bg-[#070b12] py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500" />
                    </label>
                    <label className="relative">
                        <span className="sr-only">Sort memes</span>
                        <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full appearance-none rounded-xl border border-[#2b3c57] bg-[#070b12] py-2.5 pl-3.5 pr-10 text-sm text-slate-300 outline-none focus:border-cyan-500 sm:w-48">
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                        <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    </label>
                </div>
                {isLoading && <p className="py-8 text-center text-sm text-slate-400">Loading meme templates…</p>}
                {isError && <p role="alert" className="mb-4 rounded-xl border border-rose-900/60 bg-rose-950/30 p-3 text-sm text-rose-300">Could not load saved memes. Built-in memes are still shown below.</p>}
                {actionError && <p role="alert" className="mb-4 rounded-xl border border-rose-900/60 bg-rose-950/30 p-3 text-sm text-rose-300">{actionError}</p>}
                {visibleMemes.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {visibleMemes.map((meme) => (
                            <article key={meme._id || meme.id} className="overflow-visible rounded-2xl border border-[#1b2638] bg-[#070b12] transition hover:border-[#2b3c57]">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-[#101826]">
                                    <img src={meme.image} alt={meme.name} className="h-full w-full object-cover" />
                                    <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-[#070b12]/85 px-2.5 py-1 text-[11px] text-slate-300">{meme.tags?.[0] || "Meme template"}</span>
                                    {meme._id && (
                                        <div className="absolute right-3 top-3">
                                            <button type="button" aria-label={`Actions for ${meme.name}`} aria-expanded={openMenu === meme._id} onClick={() => setOpenMenu((current) => current === meme._id ? "" : meme._id)} className="rounded-lg border border-white/10 bg-[#070b12]/90 p-2 text-slate-200 hover:bg-[#101826]"><MoreHorizontal size={18} /></button>
                                            {openMenu === meme._id && (
                                                <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-[#2b3c57] bg-[#0b111b] p-1 shadow-xl">
                                                    <button type="button" onClick={() => { setEditing(meme); setOpenMenu(""); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-[#101826]"><Pencil size={15} /> Edit meme</button>
                                                    <button type="button" onClick={() => removeMeme(meme)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-950/40"><Trash2 size={15} /> Delete meme</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="truncate text-sm font-semibold text-slate-100">{meme.name}</h2>
                                    <p className="mt-1.5 min-h-5 truncate text-xs text-slate-500">{meme.tags?.slice(0, 4).join(" · ") || "No tags"}</p>
                                    <div className="mt-4 border-t border-[#1b2638] pt-3">
                                        {meme._id
                                            ? <button type="button" onClick={() => setEditing(meme)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"><Pencil size={13} /> Edit meme</button>
                                            : <span className="text-xs text-slate-500">Built-in · Read only</span>}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : !isLoading && (
                    <div className="rounded-xl bg-[#070b12] px-5 py-14 text-center">
                        <Search size={23} className="mx-auto text-slate-500" />
                        <p className="mt-3 font-medium text-slate-200">No memes found</p>
                        <p className="mt-1 text-sm text-slate-500">Try a different title or tag.</p>
                    </div>
                )}
                <p className="mt-5 border-t border-[#1b2638] pt-4 text-xs leading-5 text-slate-500">Built-in templates are read-only. Uploaded templates can be edited and deleted here.</p>
            </section>
            {editing && <EditMemeDialog meme={editing} onClose={() => setEditing(null)} onSave={saveMeme} isSaving={isSaving} />}
        </div>
    );
};

export default AdminManage;
