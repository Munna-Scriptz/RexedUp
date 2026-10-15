import React from "react";
import { Navigate, Outlet } from "react-router";
import AdminNavbar from "../components/common/AdminNavbar";
import Loader from "../components/common/Loader";
import { useGetProfileQuery } from "../api";

const AdminLayout = () => {
    const { data, isLoading } = useGetProfileQuery();

    if (isLoading) return <Loader />

    {/* ════════════════════ Auth protection ════════════════════ */ }
    // const isAuthenticated = data?.data?.authenticated;
    // const isAdmin = data?.data?.user?.role === "admin";
    // if (!isAuthenticated) return <Navigate to="/login" replace />;
    // if (!isAdmin) return <Navigate to="/user" replace />;


    return (
        <main className="flex flex-col lg:flex-row">
            <AdminNavbar />

            <section className="flex-1 pt-6 pb-10 px-4 sm:px-6 lg:px-6 bg-[url('/src/assets/decorations/investBg.jpg')]">
                <Outlet />
            </section>
        </main>
    );
};

export default AdminLayout;
