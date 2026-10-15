import React from "react";
import { FiShield, FiLoader } from "react-icons/fi";

const Loader = ({
    title = "Checking authentication",
    subtitle = "Securing your session...",
}) => {
    return (
        <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#070708] px-4">
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[0.06] blur-[120px]" />

                <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-red-600/[0.04] blur-[100px]" />

                <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-red-500/[0.04] blur-[100px]" />
            </div>

            {/* Subtle grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px) `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Main card */}
            <div className="relative w-full max-w-[430px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#101011]/95 shadow-[0_0_80px_rgba(255,30,30,0.10)] backdrop-blur-xl">
                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                {/* Inner glow */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-72 -translate-x-1/2 rounded-full bg-red-500/[0.07] blur-3xl" />

                <div className="relative px-7 py-9 sm:px-10 sm:py-11">

                    {/* Loader */}
                    <div className="relative mx-auto mb-9 flex h-36 w-36 items-center justify-center">
                        {/* Outer glow */}
                        <div className="absolute h-32 w-32 rounded-full bg-red-500/[0.06] blur-2xl" />

                        {/* Dashed orbit */}
                        <div className="absolute h-32 w-32 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-red-500/20" />

                        {/* Outer spinning ring */}
                        <div className="absolute h-24 w-24 animate-spin rounded-full border-2 border-transparent border-t-red-500 border-r-red-500/30" />

                        {/* Reverse spinning ring */}
                        <div className="absolute h-20 w-20 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-red-400/10 border-b-red-500/70 border-l-red-500/30" />

                        {/* Center glass */}
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-[#151516] shadow-[0_0_30px_rgba(255,40,40,0.16)]">
                            <FiShield
                                size={24}
                                className="text-red-400"
                            />

                            {/* Center pulse */}
                            <div className="absolute inset-0 animate-ping rounded-2xl border border-red-500/20" />
                        </div>

                        {/* Orbit dots */}
                        <span className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 animate-pulse rounded-full bg-red-400 shadow-[0_0_10px_#ff4444]" />
                        <span className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ff3333]" />
                        <span className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 animate-pulse rounded-full bg-red-300 shadow-[0_0_10px_#ff5555]" />
                    </div>

                    {/* Heading */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[26px]">
                            {title}
                        </h2>

                        <div className="mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                        <p className="text-sm text-white/45">
                            {subtitle}
                        </p>
                    </div>

                    {/* Loading status */}
                    <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07]">
                                <FiLoader
                                    size={16}
                                    className="animate-spin text-red-400"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-left text-xs font-semibold text-white/75">
                                    Verifying session
                                </p>

                                <div className="mt-1.5 flex items-center gap-1">
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-red-400 [animation-delay:-0.3s]" />
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-red-400 [animation-delay:-0.15s]" />
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-red-400" />
                                </div>
                            </div>

                            <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">
                                Please wait
                            </span>
                        </div>

                        {/* Progress shimmer */}
                        <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-white/[0.05]">
                            <div className="h-full w-1/3 animate-[loader_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            </div>

            {/* Custom keyframes */}
            <style>{`
        @keyframes loader {
          0% {
            transform: translateX(-120%);
          }
          50% {
            transform: translateX(260%);
          }
          100% {
            transform: translateX(520%);
          }
        }
      `}</style>
        </div>
    );
};

export default Loader;