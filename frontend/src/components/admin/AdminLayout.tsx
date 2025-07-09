
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
