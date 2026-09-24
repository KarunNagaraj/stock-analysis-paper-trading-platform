import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout(): void {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <header className="sticky top-0 z-40 border-b border-sky-200/80 bg-slate-950/90 text-white shadow-[0_8px_30px_rgba(15,23,42,0.18)] backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link
                    to="/stocks"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
                        M
                    </div>

                    <div className="hidden sm:block">
                        <div className="text-base font-bold tracking-tight text-white">
                            MarketLens
                        </div>
                        <div className="text-[11px] font-medium uppercase tracking-wider text-sky-200/80">
                            Research & Paper Trading
                        </div>
                    </div>
                </Link>

                {user ? (
                    <div className="flex items-center gap-2 sm:gap-5">
                        <nav className="flex items-center gap-1">
                            <Link
                                to="/stocks"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                            >
                                Stocks
                            </Link>

                            <Link
                                to="/screener"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                            >
                                Screener
                            </Link>

                            <Link
                                to="/paper-trading"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                            >
                                Paper Trading
                            </Link>
                        </nav>

                        <div className="hidden h-6 w-px bg-white/15 md:block" />

                        <span className="hidden max-w-40 truncate text-sm text-sky-100 lg:block">
                            {user.email}
                        </span>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-200 transition hover:text-white"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;