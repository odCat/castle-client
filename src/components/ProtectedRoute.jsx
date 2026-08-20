import { useSelector } from "react-redux";
import { Navigate } from "react-router";


export default function ProtectedRoute({ children }) {
    const player = useSelector(store => store.player);

    if (!player.id) {
        return <Navigate to="/login" replace />;
    }

    return children;
}