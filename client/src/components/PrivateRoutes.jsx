import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        return !isExpired ? children : <Navigate to="/login" replace />;
    } catch {
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
