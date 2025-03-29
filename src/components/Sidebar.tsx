
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/context/SidebarContext';
import { 
  LayoutDashboard, 
  BarChartBig, 
  FileStack, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  PieChart
} from 'lucide-react';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BarChartBig, label: 'Analytics', path: '/analytics' },
    { icon: FileStack, label: 'Projects', path: '/projects' },
    { icon: PieChart, label: 'Reports', path: '/reports' },
    { icon: Users, label: 'Team', path: '/team' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-200 lg:hidden ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={toggleSidebar}
      />
      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-md transition-all duration-300 lg:static 
                    ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 h-16 border-b">
            <div className={`overflow-hidden flex items-center ${isCollapsed ? "lg:justify-center" : ""}`}>
              <div className="flex-shrink-0 bg-[#9B87F5] text-white p-1 rounded">
                <PieChart size={20} />
              </div>
              <span className={`ml-2 font-semibold text-gray-700 transition-opacity duration-200 ${isCollapsed ? "lg:opacity-0" : "opacity-100"}`}>
                Prismatica Lab
              </span>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="px-2 space-y-1">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>
                    <div 
                      className={`flex items-center px-3 py-2 rounded-md transition-colors
                        ${isActive(link.path) 
                            ? 'bg-[#F3EFFF] text-[#9B87F5]' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <link.icon className="flex-shrink-0" size={20} />
                      <span className={`ml-3 transition-opacity duration-200 ${isCollapsed ? "lg:hidden" : ""}`}>
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full flex items-center justify-center lg:justify-start"
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <ChevronRight size={18} className="hidden lg:block" />
              ) : (
                <>
                  <ChevronLeft size={18} />
                  <span className="ml-2 lg:inline-block">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
      
      <button
        className="fixed bottom-4 left-4 bg-white p-2 rounded-full shadow-lg lg:hidden z-50"
        onClick={toggleSidebar}
      >
        <ChevronRight size={20} className={`${!isCollapsed ? "hidden" : ""}`} />
      </button>
    </>
  );
};

export default Sidebar;
