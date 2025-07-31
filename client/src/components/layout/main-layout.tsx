import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { FloatingAIAssistant } from "@/components/ai/floating-ai-assistant";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/hooks/use-auth-v2";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger,
  useSidebar as useSidebarContext
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PageTransition, ParallaxContainer } from "@/components/ui/page-transition";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/hooks/use-page-transition";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  // Always declare all hooks at the top level, regardless of conditions
  const { expanded } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const transitionState = usePageTransition();

  const isAuthPage = location === "/auth";

  // We're removing the automatic sidebar closing on navigation
  // This will allow the sidebar to stay open when navigating between pages

  // Separate return for auth page to avoid conditional rendering of components with hooks
  if (isAuthPage) {
    return <div className="h-screen overflow-hidden">{children}</div>;
  }

  // Handler for mobile menu toggle
  const handleMobileMenuToggle = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isRTL ? "rtl" : "ltr"} bg-slate-50`}>
      {/* Desktop sidebar - fixed position */}
      {isAuthenticated && !isMobile && <Sidebar isMobile={false} />}
      {/* Mobile sidebar as a sheet for better mobile experience */}
      {isAuthenticated && isMobile && (
        <Sheet open={isOpen} onOpenChange={handleMobileMenuToggle}>
          <SheetContent
            side={isRTL ? "right" : "left"}
            className="p-0 m-0 border-0 shadow-2xl w-[85%] max-w-[320px] h-full min-h-[100dvh] bg-transparent overflow-hidden"
          >
            <VisuallyHidden>
              <div id="mobile-sidebar-title">Navigation Menu</div>
            </VisuallyHidden>
            <Sidebar isMobile={true} onNavItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          !isMobile && isAuthenticated && expanded
            ? isRTL
              ? "mr-[280px]"
              : "ml-[280px]"
            : !isMobile && isAuthenticated
              ? isRTL
                ? "mr-[80px]"
                : "ml-[80px]"
              : "mx-0"
        }`}
      >
        {isAuthenticated && (
          <Header
            mobileMenuOpen={isOpen}
            setMobileMenuOpen={handleMobileMenuToggle}
          />
        )}
        <main className={`flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 ${
          isMobile ? "p-3 sm:p-4" : "p-4 sm:p-6 lg:p-8"
        } transition-all duration-300 ease-in-out`}>
          <div className="max-w-full mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.02 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="h-full"
              >
                <ParallaxContainer speed={0.2} offset={5}>
                  <div className="space-y-6">
                    {children}
                  </div>
                </ParallaxContainer>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Floating AI Assistant - only show when authenticated and not on auth or AI assistant pages */}
      {isAuthenticated && !isAuthPage && !location.startsWith("/ai-assistant") && (
        <FloatingAIAssistant />
      )}
    </div>
  );
}
