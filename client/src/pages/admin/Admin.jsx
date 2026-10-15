import { Image, Layers3, Sparkles, Type } from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import { FONTS, STYLES, TEMPLATES } from "../../data/memeTemplates";
import { useGetMemeTemplatesQuery } from "../../api";

const Dashboard = () => {
    const { data, isLoading, isError } = useGetMemeTemplatesQuery();
    const uploaded = Array.isArray(data?.data) ? data.data : [];
    const templates = [...TEMPLATES, ...uploaded];
    const stats = [
        { title: "Total memes", value: templates.length, icon: <Image />, variant: "blue" },
        { title: "Uploaded memes", value: uploaded.length, icon: <Layers3 />, variant: "purple" },
        { title: "Text styles", value: STYLES.length, icon: <Sparkles />, variant: "amber" },
        { title: "Fonts available", value: FONTS.length, icon: <Type />, variant: "green" },
    ];

    return (
        <div className="mx-auto max-w-7xl">
            <header className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Overview</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Dashboard</h1>
                <p className="mt-2 text-sm text-slate-400">A quick look at your meme templates and creative tools.</p>
            </header>
            <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">
                {stats.map((stat) => <StatCard key={stat.title} {...stat} className="!rounded-2xl !border-[#1b2638] !bg-[#0b111b] !shadow-none hover:!border-[#2b3c57]" />)}
            </div>
            <section className="rounded-2xl border border-[#1b2638] bg-[#0b111b] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="font-semibold text-slate-100">Meme library</h2>
                        <p className="mt-1 text-sm text-slate-400">Recently added editor templates.</p>
                    </div>
                    <span className="rounded-full border border-[#2b3c57] bg-[#101826] px-3 py-1 text-xs text-slate-300">{templates.length} memes</span>
                </div>
                {isError && <p role="alert" className="mb-4 rounded-xl border border-rose-900/60 bg-rose-950/30 p-3 text-sm text-rose-300">Could not load uploaded memes. Showing the built-in templates.</p>}
                {isLoading && <p className="mb-4 text-sm text-slate-500">Loading uploaded memes…</p>}
                <div className="divide-y divide-[#1b2638]">
                    {(uploaded.length ? uploaded.slice(0, 6) : TEMPLATES.slice(-6).reverse()).map((template) => (
                        <div key={template.id || template._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                            <img src={template.image} alt="" className="h-11 w-11 rounded-xl bg-[#101826] object-cover" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-slate-200">{template.name}</p>
                                <p className="mt-0.5 truncate text-xs text-slate-500">{template.tags?.slice(0, 3).join(" · ")}</p>
                            </div>
                            <span className="hidden rounded-full border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 text-xs text-emerald-300 sm:inline-flex">
                                {template._id ? "Uploaded" : "Built in"}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
