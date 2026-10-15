import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
    Check,
    ChevronDown,
    CloudUpload,
    Image,
    Layers3,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Shapes,
    Sparkles,
    Trash2,
    Type,
    X,
} from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import { FONTS, STYLES, TEMPLATES } from "../../data/memeTemplates";

const PageHeader = ({ eyebrow, title, description, action }) => (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">{eyebrow}</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
        {action}
    </div>
);

const Dashboard = () => {
    const categoryCount = new Set(TEMPLATES.flatMap((template) => template.tags)).size;
    const stats = [
        { title: "Total memes", value: TEMPLATES.length, icon: <Image />, variant: "blue" },
        { title: "Tags in use", value: categoryCount, icon: <Layers3 />, variant: "purple" },
        { title: "Text styles", value: STYLES.length, icon: <Sparkles />, variant: "amber" },
        { title: "Fonts available", value: FONTS.length, icon: <Type />, variant: "green" },
    ];

    return (
        <>
            <PageHeader
                eyebrow="Overview"
                title="Dashboard"
                description="A quick look at the meme templates and creative tools in your library."
            />

            <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} className="!rounded-2xl !border-slate-200 !shadow-sm" />
                ))}
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="font-semibold text-slate-900">Template library</h2>
                        <p className="mt-1 text-sm text-slate-500">The latest templates available in the editor.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {TEMPLATES.length} templates
                    </span>
                </div>
                <div className="divide-y divide-slate-100">
                    {TEMPLATES.slice(-5).reverse().map((template) => (
                        <div key={template.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                            <img src={template.image} alt="" className="h-11 w-11 rounded-xl bg-slate-100 object-cover" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-slate-800">{template.name}</p>
                                <p className="mt-0.5 truncate text-xs text-slate-500">{template.tags.slice(0, 3).join(" · ")}</p>
                            </div>
                            <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
                                In library
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

const UploadMeme = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]?.id ?? "");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [font, setFont] = useState(FONTS[0]?.[0] ?? "");
    const [style, setStyle] = useState(STYLES[0]?.[0] ?? "");
    const template = TEMPLATES.find((item) => item.id === selectedTemplate);
    const [filePreview, setFilePreview] = useState("");

    useEffect(() => {
        if (!file) {
            setFilePreview("");
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setFilePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage("Preview only — this upload form is not connected to a server yet.");
    };

    return (
        <>
            <PageHeader
                eyebrow="Content"
                title="Upload a meme"
                description="Prepare a new template with a preview, title, and editor defaults."
            />
            <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="font-semibold text-slate-900">Meme image</h2>
                        <p className="mt-1 text-sm text-slate-500">Choose an image file or start from a template already in the editor.</p>
                        <label className="mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                                <CloudUpload size={23} />
                            </span>
                            <span className="text-sm font-semibold text-slate-800">{file ? file.name : "Drop an image here or browse"}</span>
                            <span className="mt-1 text-xs text-slate-500">PNG, JPG, GIF · Image preview only</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) => {
                                    setFile(event.target.files?.[0] ?? null);
                                    setMessage("");
                                }}
                            />
                        </label>
                        <div className="mt-4">
                            <label htmlFor="template-source" className="mb-2 block text-sm font-medium text-slate-700">Or use an existing template</label>
                            <select
                                id="template-source"
                                value={selectedTemplate}
                                onChange={(event) => setSelectedTemplate(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            >
                                {TEMPLATES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="font-semibold text-slate-900">Template details</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                                Meme title
                                <input
                                    required
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="e.g. Shadow Domain"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                />
                            </label>
                            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                                Tags
                                <input
                                    value={tags}
                                    onChange={(event) => setTags(event.target.value)}
                                    placeholder="anime, reaction, jjk"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                />
                                <span className="mt-1.5 block text-xs font-normal text-slate-500">Separate tags with commas.</span>
                            </label>
                            <label className="text-sm font-medium text-slate-700">
                                Default font
                                <select value={font} onChange={(event) => setFont(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-indigo-400">
                                    {FONTS.map(([name]) => <option key={name} value={name}>{name}</option>)}
                                </select>
                            </label>
                            <label className="text-sm font-medium text-slate-700">
                                Text style
                                <select value={style} onChange={(event) => setStyle(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-indigo-400">
                                    {STYLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                            </label>
                        </div>
                    </section>
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                            <Plus size={17} /> Preview template
                        </button>
                        {message && <p className="text-sm text-amber-700" role="status">{message}</p>}
                    </div>
                </div>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:sticky xl:top-8">
                    <div className="mb-4 flex items-center gap-2">
                        <Image size={17} className="text-indigo-600" />
                        <h2 className="font-semibold text-slate-900">Live preview</h2>
                    </div>
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        {(filePreview || template?.image)
                            ? <img src={filePreview || template.image} alt={title || template?.name || "Meme preview"} className="h-full w-full object-contain" />
                            : <div className="px-6 text-center text-sm text-slate-400">Your image preview will appear here</div>}
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold text-slate-900">{title || template?.name || "Untitled meme"}</p>
                        <p className="mt-1 text-xs text-slate-500">{tags || template?.tags?.slice(0, 3).join(", ") || "Add a few searchable tags"}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{font}</span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">{style}</span>
                        </div>
                    </div>
                    <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                        Upload and save actions are visual previews only. No meme upload endpoint is connected.
                    </p>
                </aside>
            </form>
        </>
    );
};

const EditMemeDialog = ({ meme, onClose, onSave }) => {
    const [name, setName] = useState(meme.name);
    const [tags, setTags] = useState(meme.tags.join(", "));

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({ ...meme, name: name.trim(), tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <form onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="edit-meme-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <h2 id="edit-meme-title" className="text-lg font-semibold text-slate-900">Edit meme</h2>
                        <p className="mt-1 text-sm text-slate-500">Update the title and searchable tags.</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close edit dialog" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><X size={19} /></button>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                    Meme title
                    <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                </label>
                <label className="mt-4 block text-sm font-medium text-slate-700">
                    Tags
                    <input value={tags} onChange={(event) => setTags(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                </label>
                <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"><Check size={16} /> Save changes</button>
                </div>
            </form>
        </div>
    );
};

const ManageMemes = () => {
    const [memes, setMemes] = useState(TEMPLATES);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("newest");
    const [openMenu, setOpenMenu] = useState("");
    const [editing, setEditing] = useState(null);

    const visibleMemes = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        const filtered = memes.filter((meme) =>
            meme.name.toLowerCase().includes(normalizedQuery) ||
            meme.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        );
        return sort === "oldest" ? filtered : filtered.slice().reverse();
    }, [memes, query, sort]);

    const deleteMeme = (meme) => {
        if (!window.confirm(`Remove "${meme.name}" from this preview? This is not a server-side delete.`)) return;
        setMemes((current) => current.filter((item) => item.id !== meme.id));
        setOpenMenu("");
    };

    const saveMeme = (updated) => {
        setMemes((current) => current.map((item) => item.id === updated.id ? updated : item));
        setEditing(null);
    };

    return (
        <>
            <PageHeader
                eyebrow="Content"
                title="Manage memes"
                description="Browse the meme templates currently included in the editor."
                action={<span className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"><Shapes size={16} className="text-indigo-600" /> {memes.length} memes</span>}
            />
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex-1">
                        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search memes or tags..."
                            aria-label="Search memes or tags"
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                    </label>
                    <label className="relative">
                        <span className="sr-only">Sort memes</span>
                        <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-400 sm:w-52">
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                        <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </label>
                </div>

                {visibleMemes.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                        {visibleMemes.map((meme) => (
                            <article key={meme.id} className="overflow-visible rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
                                    <img src={meme.image} alt={meme.name} className="h-full w-full object-cover" />
                                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-600 backdrop-blur">{meme.tags[0] || "Uncategorized"}</span>
                                    <div className="absolute right-3 top-3">
                                        <button
                                            type="button"
                                            aria-label={`Actions for ${meme.name}`}
                                            aria-expanded={openMenu === meme.id}
                                            onClick={() => setOpenMenu((current) => current === meme.id ? "" : meme.id)}
                                            className="rounded-lg bg-white/95 p-2 text-slate-700 shadow-sm backdrop-blur hover:bg-white"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        {openMenu === meme.id && (
                                            <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                                                <button type="button" onClick={() => { setEditing(meme); setOpenMenu(""); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"><Pencil size={15} /> Edit meme</button>
                                                <button type="button" onClick={() => deleteMeme(meme)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"><Trash2 size={15} /> Delete meme</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h2 className="truncate font-semibold text-slate-900">{meme.name}</h2>
                                    <p className="mt-1.5 min-h-5 truncate text-xs text-slate-500">{meme.tags.slice(0, 4).join(" · ") || "No tags"}</p>
                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                        <span className="text-xs text-slate-400">Editor template</span>
                                        <button type="button" onClick={() => setEditing(meme)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"><Pencil size={13} /> Edit</button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl bg-slate-50 px-5 py-14 text-center">
                        <Search size={23} className="mx-auto text-slate-400" />
                        <p className="mt-3 font-medium text-slate-800">No memes found</p>
                        <p className="mt-1 text-sm text-slate-500">Try a different title or tag.</p>
                    </div>
                )}
                <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
                    Meme editing and deletion are local previews. The current template library is static and has no management API.
                </p>
            </section>
            {editing && <EditMemeDialog meme={editing} onClose={() => setEditing(null)} onSave={saveMeme} />}
        </>
    );
};

const Admin = () => {
    const { pathname } = useLocation();

    if (pathname === "/admin/upload") return <UploadMeme />;
    if (pathname === "/admin/manage") return <ManageMemes />;
    return <Dashboard />;
};

export default Admin;
