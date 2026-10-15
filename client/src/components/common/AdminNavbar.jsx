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
    const [logout] = useLogoutMutation();
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
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
        >
            <Icon size={18} />
            {label}
        </NavLink>
    ));

    const signOut = (
        <div>
            {logoutError && <p className="mb-2 px-3 text-xs text-rose-600" role="alert">{logoutError}</p>}
            <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
            >
                <LogOut size={18} />
                Sign out
            </button>
        </div>
    );

    return (
        <>
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
                <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <Shapes size={20} />
                    </div>
                    <div>
                        <p className="font-semibold tracking-tight text-slate-900">RexedUp</p>
                        <p className="text-xs text-slate-500">Meme studio</p>
                    </div>
                </div>
                <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-4 py-6">
                    {links()}
                </nav>
                <div className="border-t border-slate-100 p-4">{signOut}</div>
            </aside>

            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <Shapes size={17} />
                    </span>
                    RexedUp admin
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                >
                    <Menu size={21} />
                </button>
            </header>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() => setMobileOpen(false)}
                        className="absolute inset-0 bg-slate-950/40"
                    />
                    <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
                        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
                            <span className="font-semibold text-slate-900">Admin menu</span>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close navigation"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-4 py-5">
                            {links(true)}
                        </nav>
                        <div className="border-t border-slate-100 p-4">{signOut}</div>
                    </aside>
                </div>
            )}
        </>
    );
};

export default AdminNavbar;
