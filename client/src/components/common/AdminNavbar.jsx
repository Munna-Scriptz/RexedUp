import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Logo from "/rexedupInfo.png";
import { FiGrid, FiPlusCircle,  FiSettings, FiLogOut, FiX, FiMenu } from "react-icons/fi";
import { useLogoutMutation } from "../../api";

const AdminNavbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const tabs = [
        {
            id: "dashboard",
            path: "/admin",
            label: "Dashboard",
            icon: FiGrid,
        },
        {
            id: "invest",
            path: "/admin/upload",
            label: "Upload meme",
            icon: FiPlusCircle,
        },
        {
            id: "settings",
            path: "/user/settings",
            label: "Settings",
            icon: FiSettings,
        },
    ];

    {/* ════════════════════ Logout ════════════════════ */ }
    const [logout] = useLogoutMutation()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {/* ========================================================= DESKTOP SIDEBAR ========================================================= */}
            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-hidden border-r border-[#4a1717] bg-[#180101] lg:flex lg:flex-col">
                {/* Command Center Header */}
                <div className="relative border-b border-red-down/50 bg-gradient-to-r from-[#320707] via-[#6d1010] to-[#320707] px-5 py-5">
                    {/* Decorative lines */}
                    <div className="absolute bottom-0 left-0 h-px w-full bg-red-down" />

                    <div className="relative flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ff3b3b]/50 bg-red-down/15 text-[#ff3b3b]">
                            <FiGrid size={21} />
                        </div>

                        <h2 className="mt-0.5 text-lg font-bold uppercase tracking-wide text-white">
                            Admin Panel
                        </h2>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin" >
                    <div className="space-y-1">
                        {tabs.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    end={item.path === "/admin"}
                                    className={({
                                        isActive,
                                    }) => ` group relative flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-sm transition-all duration-200
                                        ${isActive
                                            ? `border-red-down/50 bg-[#4b0909] text-white shadow-[inset_3px_0_0_#ff1a1a] `
                                            : `border-transparent text-white/55 hover:border-[#4a1717] hover:bg-[#260606] hover:text-white `
                                        }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md 
                                                    ${isActive
                                                    ? "bg-red-down/15"
                                                    : "bg-[#160303] group-hover:bg-[#250606]"} `}
                                            >
                                                <Icon
                                                    size={18}
                                                    className={
                                                        isActive ? "text-red-down" : "text-[#20b486]"
                                                    }
                                                />
                                            </div>

                                            <span className="font-medium">{item.label}</span>

                                            {isActive && (
                                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ff3030]" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout */}
                <div className="border-t border-[#4a1717] p-2">
                    <button
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-3.5 py-3 text-sm font-medium text-white/50 transition-all duration-200 hover:border-red-down/30 hover:bg-[#320707] hover:text-[#ff5c5c "
                    >
                        <FiLogOut
                            size={18}
                            className="transition-transform duration-200 group-hover:-translate-x-0.5"
                        />

                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ========================================================= MOBILE HEADER ========================================================= */}
            <div className="lg:hidden">
                <header className="border-b border-red-down/50 bg-gradient-to-r from-[#360707] via-[#6b1010] to-[#360707]">
                    <div className="flex h-[60px] items-center justify-between px-4">
                        {/* Menu Button */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex items-center gap-3 rounded-lg border border-[#4a1717] bg-[#180303] px-3 py-2 text-white transition hover:border-red-down/50 hover:bg-[#260606] "
                            aria-label="Open command center"
                        >
                            <FiMenu size={20} className="text-red-down" />

                            <div className="hidden xs:block text-left">
                                <span className="block text-[9px] font-bold uppercase text-[#ff6666]">
                                    Member Area
                                </span>

                                <span className="block text-xs font-bold uppercase tracking-wide text-white">
                                    Command Center
                                </span>
                            </div>
                        </button>

                        {/* Logo */}
                        <div className="h-10 w-auto">
                            <img
                                src={Logo}
                                alt="BitBillionaire"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </div>
                </header>
            </div>

            {/* ========================================================= MOBILE DRAWER ========================================================= */}
            <div
                className={` fixed inset-0 z-50 lg:hidden transition-all duration-300 ${mobileOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/75"
                    onClick={() => setMobileOpen(false)}
                />

                {/* Drawer */}
                <aside
                    className={` relative z-10 flex h-full w-[86%] max-w-[340px] flex-col overflow-hidden border-r border-[#5c1717] bg-[#0b0101] shadow-[15px_0_50px_rgba(0,0,0,0.6)] transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} `}
                >
                    {/* Drawer Header */}
                    <div className="border-b border-red-down/50 bg-gradient-to-r from-[#360707] via-[#6b1010] to-[#360707]">
                        <div className="flex items-center justify-between px-4 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ff4545]/50 bg-red-down/15 text-[#ff3d3d]">
                                    <FiGrid size={18} />
                                </div>

                                <h2 className="text-base font-bold uppercase tracking-wide text-white">
                                    Command Center
                                </h2>
                            </div>

                            <button
                                onClick={() => setMobileOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-white/60 transition hover:border-red-down/50 hover:bg-red-down/20 hover:text-white "
                                aria-label="Close menu"
                            >
                                <FiX size={19} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
                        <div className="space-y-1">
                            {tabs.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.id}
                                        to={item.path}
                                        end={item.path === "/user"}
                                        onClick={() => setMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `group relative flex items-center gap-3 rounded-lg border px-2.5 py-2.5 text-sm transition-all duration-200 ${isActive
                                                ? `border-red-down/50 bg-[#4b0909] text-white shadow-[inset_3px_0_0_#ff1a1a] `
                                                : `border-transparent text-white/60 hover:border-[#4a1717] hover:bg-[#260606] hover:text-white `
                                            } `
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md 
                                                    ${isActive
                                                        ? "bg-red-down/15"
                                                        : "bg-[#160303] group-hover:bg-[#250606]"} `}
                                                >
                                                    <Icon
                                                        size={17}
                                                        className={
                                                            isActive ? "text-red-down" : "text-[#20b486]"
                                                        }
                                                    />
                                                </div>

                                                <span className="font-medium">{item.label}</span>

                                                {isActive && (
                                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ff3030]" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Mobile Logout */}
                    <div className="border-t border-[#4a1717] p-3">
                        <button
                            onClick={() => {
                                setMobileOpen(false);
                                handleLogout();
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-down/20 bg-[#280606] px-4 py-3.5 text-sm font-semibold text-[#ff6868] transition-all duration-200 hover:border-red-down/50 hover:bg-[#420909] hover:text-[#ff8585] "
                        >
                            <FiLogOut size={17} />
                            Sign Out
                        </button>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default AdminNavbar;
