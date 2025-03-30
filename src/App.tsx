
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { ProjectProvider } from "./context/ProjectContext";

// Create the query client outside of the component to avoid recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Create a layout component that uses the sidebar context
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed, isMobile } = useSidebar();
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main 
        className={`flex-1 transition-all duration-300 overflow-x-hidden
                   ${!isMobile && (isCollapsed ? 'ml-[72px]' : 'ml-64')}`}
      >
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <ProjectProvider>
            <div className="min-h-screen bg-apple-light text-apple-neutral">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </div>
          </ProjectProvider>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
