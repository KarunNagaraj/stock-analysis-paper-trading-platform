import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();
        setError("");

        try {
            await register({
                email,
                password,
            });

            navigate("/stocks");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Registration failed");
            }
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.15),transparent_30%),linear-gradient(180deg,#edf5ff_0%,#f8fafc_100%)] px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                <div className="mb-8">
                    <div className="mb-3 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                        MarketLens
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Start analyzing stocks and managing your portfolio.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                            minLength={8}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                        Create account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-gray-900 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;