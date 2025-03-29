
import React, { createContext, useContext, useState, useEffect } from 'react';

type SidebarContextType = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    setIsCollapsed(true);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, closeSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
