import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, LockKeyhole, Shapes } from "lucide-react";
import { useLoginMutation, useLogoutMutation } from "../../api";

const getErrorMessage = (error) =>
    error?.data?.message ||
    error?.data?.error ||
    error?.error ||
    "Unable to sign in. Check your email and password.";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        try {
            const result = await login({ email: email.trim(), password }).unwrap();
            if (result?.data?.role !== "admin") {
                await logout().unwrap();
                setMessage("This account does not have admin access.");
                return;
            }
            navigate("/admin", { replace: true });
        } catch (error) {
            setMessage(getErrorMessage(error));
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-4 py-10 text-slate-100">
            <div className="w-full max-w-md">
                <div className="mb-7 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                        <Shapes size={25} />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">RexedUp studio</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight">Admin sign in</h1>
                    <p className="mt-2 text-sm text-slate-400">Sign in to manage the meme template library.</p>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-[#1b2638] bg-[#0b111b] p-6 shadow-sm sm:p-8">
                    <label className="block text-sm font-medium text-slate-300">
                        Email address
                        <input
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin@example.com"
                            className="mt-2 w-full rounded-xl border border-[#2b3c57] bg-[#070b12] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-900/30"
                        />
                    </label>
                    <label className="mt-4 block text-sm font-medium text-slate-300">
                        Password
                        <input
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            className="mt-2 w-full rounded-xl border border-[#2b3c57] bg-[#070b12] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-900/30"
                        />
                    </label>
                    {message && <p className="mt-4 rounded-xl border border-rose-900/60 bg-rose-950/30 px-3.5 py-3 text-sm text-rose-300" role="alert">{message}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-[#031018] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LockKeyhole size={16} />
                        {isLoading ? "Signing in..." : "Sign in"}
                        {!isLoading && <ArrowRight size={16} className="ml-auto" />}
                    </button>
                    <p className="mt-4 text-center text-xs leading-5 text-slate-500">Admin access only. Account creation is not available here.</p>
                </form>
            </div>
        </main>
    );
};

export default AdminLogin;
