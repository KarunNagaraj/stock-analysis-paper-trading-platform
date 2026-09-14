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
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    to="/stocks"
                    className="text-xl font-bold text-gray-900"
                >
                    Stock Market
                </Link>

                {user ? (
                    <div className="flex items-center gap-6">
                        <Link
                            to="/stocks"
                            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                        >
                            Stocks
                        </Link>

                        <Link
                            to="/screener"
                            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                        >
                            Screener
                        </Link>

                        <Link
                            to="/paper-trading"
                            className="text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                            Paper Trading
                        </Link>

                        <span className="text-sm text-gray-500">
                            {user.email}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;