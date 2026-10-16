import { Navigate, Outlet, useLocation } from "react-router";
import AdminNavbar from "../components/common/AdminNavbar";
import Loader from "../components/common/Loader";
import { useGetProfileQuery } from "../api";

const AdminLayout = () => {
    const { data, isLoading, isError } = useGetProfileQuery();
    console.log(data)
    const { pathname } = useLocation();
    const isEditorPage = pathname === "/admin/upload";

    if (isLoading) return <Loader />;
    if (isError || !data?.data?.authenticated || data.data.user?.role !== "admin") return <Navigate to="/admin/login" replace />


    return (
        <main className="min-h-screen bg-[#070b12] text-slate-100 lg:flex">
            <AdminNavbar />
            <section className={`min-w-0 flex-1 ${isEditorPage ? "p-0" : "px-4 py-6 sm:px-6 lg:px-10"}`}>
                <Outlet />
            </section>
        </main>
    );
};

export default AdminLayout;
