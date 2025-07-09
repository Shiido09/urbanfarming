
import { BarChart3, ShoppingBag, Package, TrendingUp, MessageSquare, HelpCircle, Settings, ChevronLeft, Sun, Moon, Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  };

  const menuItems = [
    {
      section: "GENERAL",
      items: [
        { name: "Dashboard", path: "/admin", icon: BarChart3 },
        { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
        { name: "Products", path: "/admin/products", icon: Package },
        { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
        { name: "Messages", path: "/admin/messages", icon: MessageSquare },
      ]
    },
    {
      section: "HELP & SETTINGS",
      items: [
        { name: "Customer support", path: "/admin/support", icon: HelpCircle },
        { name: "Settings", path: "/admin/settings", icon: Settings },
      ]
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-900 shadow-sm min-h-screen border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        {/* Header with Logo and Collapse Button */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              {/* Creative Logo: Leaves + Shopping Bag */}
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-red-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <Leaf className="absolute -top-1 -right-1 w-4 h-4 text-green-600 transform rotate-12" />
                <Leaf className="absolute -bottom-1 -left-1 w-3 h-3 text-green-500 transform -rotate-12" />
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-white">HarvestConnect</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className={`${isCollapsed ? 'flex justify-center' : 'flex items-center justify-between'} mb-6 px-2`}>
          {!isCollapsed && <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  {section.section}
                </h3>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                      location.pathname === item.path
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                ))}
              </nav>
              {isCollapsed && sectionIndex < menuItems.length - 1 && (
                <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
              )}
            </div>
          ))}
        </div>

        {/* Collapsed Logo */}
        {isCollapsed && (
          <div className="mt-8 flex justify-center">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-red-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <Leaf className="absolute -top-1 -right-1 w-4 h-4 text-green-600 transform rotate-12" />
              <Leaf className="absolute -bottom-1 -left-1 w-3 h-3 text-green-500 transform -rotate-12" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
