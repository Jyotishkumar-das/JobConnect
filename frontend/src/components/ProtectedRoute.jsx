import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useAuth();

    // User is not logged in
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    // Check role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "candidate") {
            return <Navigate to="/my-applications" replace />;
        }

        if (user.role === "recruiter") {
            return <Navigate to="/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;