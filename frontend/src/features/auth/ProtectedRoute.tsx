import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />; //replace tells React Router to replace the current browser history entry instead of adding a new one.
    }

    return <Outlet />;
}

export default ProtectedRoute;