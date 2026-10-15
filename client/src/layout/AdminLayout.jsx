import { Navigate, Outlet } from "react-router";
import AdminNavbar from "../components/common/AdminNavbar";
import Loader from "../components/common/Loader";
import { useGetProfileQuery } from "../api";

const AdminLayout = () => {
    const { data, isLoading, isError } = useGetProfileQuery();

    // if (isLoading) return <Loader />;
    // if (isError || !data?.data?.authenticated || data.data.user?.role !== "admin") {
    //     return <Navigate to="/admin/login" replace />;
    // }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
            <AdminNavbar />
            <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
                <Outlet />
            </section>
        </main>
    );
};

export default AdminLayout;
