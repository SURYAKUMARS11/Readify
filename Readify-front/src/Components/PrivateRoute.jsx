import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token"); 
  const userRole = localStorage.getItem("userRole"); 
  const location = useLocation();

  console.log("Current Role in Storage:", userRole);
  console.log("Required Role for this Route:", allowedRole);

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRole && userRole?.toLowerCase() !== allowedRole.toLowerCase()) {
    console.warn("Role mismatch! Redirecting to /home");
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;