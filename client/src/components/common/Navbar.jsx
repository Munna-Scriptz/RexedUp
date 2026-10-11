import { FaFacebookF, FaGithub, FaInstagram } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import logo from "/rexedupInfo.png"
import { Link } from "react-router";

const Navbar = ({ surprise }) => {
    return (
        <header className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-[#05080e]/85 px-4 py-3 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
                
                <Link to={"/"}>
                    <img src={logo} className="md:w-44 w-30" alt="Logo" />
                </Link>

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <a
                        className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 text-xs font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:bg-slate-800 hover:text-cyan-200 sm:h-10 sm:px-4 sm:text-sm"
                        href="https://github.com/Munna-Scriptz"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        <FaGithub size={17} aria-hidden="true" />
                        <span className="hidden md:inline">My GitHub</span>
                    </a>
                    <a
                        className="grid size-9 place-items-center rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-300 transition hover:border-blue-400/60 hover:bg-blue-500/10 hover:text-blue-300 sm:size-10"
                        href="https://www.facebook.com/rexonfr"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Facebook"
                        title="Facebook"
                    >
                        <FaFacebookF size={16} aria-hidden="true" />
                    </a>
                    <a
                        className="grid size-9 place-items-center rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-300 transition hover:border-sky-400/60 hover:bg-sky-500/10 hover:text-sky-300 sm:size-10"
                        href="https://www.instagram.com/rexofr"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="LinkedIn"
                        title="LinkedIn"
                    >
                        <FaInstagram size={17} aria-hidden="true" />
                    </a>
                    <button
                        className="inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-3 text-xs font-bold text-slate-950 shadow-lg shadow-blue-500/15 transition hover:brightness-110 active:scale-[.98] sm:h-10 sm:px-4 sm:text-sm"
                        type="button"
                        onClick={surprise}
                    >
                        <IoShuffleOutline size={16} aria-hidden="true" />
                        <span className="hidden sm:inline">Surprise me</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar