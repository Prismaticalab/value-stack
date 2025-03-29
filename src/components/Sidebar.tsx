
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/context/SidebarContext';
import { 
  BarChart3, 
  FileBarChart, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  PieChart,
  Blocks
} from 'lucide-react';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const location = useLocation();

  const sidebarLinks = [
    { icon: Blocks, label: 'Dashboard', path: '/' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: FileBarChart, label: 'Projects', path: '/projects' },
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
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-20 transition-opacity duration-300 lg:hidden ${
            isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full transition-all duration-300 ease-in-out 
                    ${isCollapsed ? 
                      (isMobile ? '-translate-x-full' : 'w-[72px]') : 
                      'w-64'}`}
      >
        <div className="flex flex-col h-full bg-white shadow-apple border-r border-gray-100 backdrop-blur-lg">
          <div className="flex items-center p-4 h-16">
            <div className={`flex items-center ${isCollapsed && !isMobile ? "justify-center w-full" : ""}`}>
              <div className="flex-shrink-0 bg-apple-primary text-white p-1.5 rounded-lg">
                <PieChart size={isCollapsed && !isMobile ? 24 : 20} />
              </div>
              <span className={`ml-3 font-semibold transition-opacity duration-200 
                              ${isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                Prismatica Lab
              </span>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="px-2 space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>
                    <div 
                      className={`flex items-center px-3 py-2.5 rounded-xl transition-all
                        ${isCollapsed && !isMobile ? "justify-center" : ""}
                        ${isActive(link.path) 
                            ? 'bg-[#f1f5fd] text-apple-primary' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                      title={isCollapsed && !isMobile ? link.label : ""}
                    >
                      <link.icon className="flex-shrink-0" size={isCollapsed && !isMobile ? 24 : 20} />
                      <span className={`ml-3 transition-all duration-200 
                                      ${isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${isCollapsed && !isMobile ? "w-full justify-center" : "w-full"} 
                         text-gray-500 hover:text-apple-primary hover:bg-[#f1f5fd]`}
              onClick={toggleSidebar}
            >
              {isCollapsed && !isMobile ? (
                <ChevronRight size={18} />
              ) : (
                <>
                  <ChevronLeft size={18} />
                  <span className="ml-2">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile trigger button */}
      {isMobile && isCollapsed && (
        <button
          className="fixed bottom-6 left-6 bg-white p-3 rounded-full shadow-apple z-50"
          onClick={toggleSidebar}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
