
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

type AdminRouteProps = {
    children: ReactNode;
};

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isAdmin, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="rounded-md h-12 w-12 border-4 border-t-primary border-primary/30 animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
