import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, LogOut, Menu, Plus, Shapes, X } from "lucide-react";
import { useLogoutMutation } from "../../api";

const navigation = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { path: "/admin/upload", label: "Upload meme", icon: Plus },
    { path: "/admin/manage", label: "Manage memes", icon: Shapes },
];

const AdminNavbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutError, setLogoutError] = useState("");
    const [logout, { isLoading }] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLogoutError("");
        try {
            await logout().unwrap();
            navigate("/admin/login", { replace: true });
        } catch {
            setLogoutError("Could not sign out. Please try again.");
        }
    };

    const links = (mobile = false) => navigation.map(({ path, label, icon: Icon, end }) => (
        <NavLink
            key={path}
            to={path}
            end={end}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                isActive
                    ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                    : "border-transparent text-slate-400 hover:bg-[#101826] hover:text-slate-100"
            }`}
        >
            <Icon size={18} />
            {label}
        </NavLink>
    ));

    const signOut = (
        <div>
            {logoutError && <p className="mb-2 px-3 text-xs text-rose-300" role="alert">{logoutError}</p>}
            <button
                type="button"
                disabled={isLoading}
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-rose-950/30 hover:text-rose-300 disabled:opacity-50"
            >
                <LogOut size={18} />
                {isLoading ? "Signing out…" : "Sign out"}
            </button>
        </div>
    );

    return (
        <>
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#1b2638] bg-[#0b111b] lg:flex">
                <div className="flex h-20 items-center gap-3 border-b border-[#1b2638] px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-400/10 text-cyan-300">
                        <Shapes size={20} />
                    </div>
                    <div>
                        <p className="font-semibold tracking-tight text-slate-100">RexedUp</p>
                        <p className="text-xs text-slate-500">Meme studio</p>
                    </div>
                </div>
                <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-4 py-6">
                    {links()}
                </nav>
                <div className="border-t border-[#1b2638] p-4">{signOut}</div>
            </aside>

            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1b2638] bg-[#0b111b] px-4 lg:hidden">
                <div className="flex items-center gap-2 font-semibold text-slate-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                        <Shapes size={17} />
                    </span>
                    RexedUp admin
                </div>
                <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-slate-300 hover:bg-[#101826]">
                    <Menu size={21} />
                </button>
            </header>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/70" />
                    <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-[#1b2638] bg-[#0b111b] shadow-xl">
                        <div className="flex h-16 items-center justify-between border-b border-[#1b2638] px-5">
                            <span className="font-semibold text-slate-100">Admin menu</span>
                            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 text-slate-400 hover:bg-[#101826]"><X size={20} /></button>
                        </div>
                        <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-4 py-5">{links(true)}</nav>
                        <div className="border-t border-[#1b2638] p-4">{signOut}</div>
                    </aside>
                </div>
            )}
        </>
    );
};

export default AdminNavbar;
