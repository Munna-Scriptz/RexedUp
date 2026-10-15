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
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
            <div className="w-full max-w-md">
                <div className="mb-7 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                        <Shapes size={25} />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">RexedUp studio</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight">Admin sign in</h1>
                    <p className="mt-2 text-sm text-slate-500">Sign in to manage the meme template library.</p>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <label className="block text-sm font-medium text-slate-700">
                        Email address
                        <input
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin@example.com"
                            className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                    </label>
                    <label className="mt-4 block text-sm font-medium text-slate-700">
                        Password
                        <input
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                    </label>
                    {message && <p className="mt-4 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-700" role="alert">{message}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LockKeyhole size={16} />
                        {isLoading ? "Signing in..." : "Sign in"}
                        {!isLoading && <ArrowRight size={16} className="ml-auto" />}
                    </button>
                    <p className="mt-4 text-center text-xs leading-5 text-slate-400">Admin access only. Account creation is not available here.</p>
                </form>
            </div>
        </main>
    );
};

export default AdminLogin;
