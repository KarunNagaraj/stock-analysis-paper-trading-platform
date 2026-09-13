import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout(): void {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <nav>
            <Link to="/stocks">Stocks</Link>
            {" | "}
            <Link to="/screener">Screener</Link>

            <span>
                {user?.email}
            </span>

            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;