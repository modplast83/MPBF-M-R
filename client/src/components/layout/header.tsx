import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-v2";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";
import { Loader2, Menu, HelpCircle, Building2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthenticationButton } from "@/components/authentication-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import AnimatedLanguageToggle from "@/components/ui/animated-language-toggle";

interface HeaderProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, isRTL } = useLanguage();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Logout is now handled by the AuthenticationButton component

  // Function to toggle mobile sidebar
  const toggleMobileSidebar = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  // Function to get current page title based on location
  const getCurrentPageTitle = () => {
    // First check for exact matches
    for (const section of SIDEBAR_ITEMS) {
      for (const item of section.items) {
        if (item.path === location) {
          return t(`sidebar.${item.title.toLowerCase().replace(/ /g, "_")}`);
        }

        // Check subItems if they exist
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.path === location) {
              return t(
                `sidebar.${subItem.title.toLowerCase().replace(/ /g, "_")}`,
              );
            }
          }
        }
      }
    }

    // Check for path startsWith for nested routes
    for (const section of SIDEBAR_ITEMS) {
      for (const item of section.items) {
        if (location.startsWith(item.path) && item.path !== "/") {
          return t(`sidebar.${item.title.toLowerCase().replace(/ /g, "_")}`);
        }

        // Check subItems if they exist
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (location.startsWith(subItem.path)) {
              return t(
                `sidebar.${subItem.title.toLowerCase().replace(/ /g, "_")}`,
              );
            }
          }
        }
      }
    }

    // Default to Dashboard
    return t("sidebar.dashboard");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b glass backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 animate-slide-in">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Building2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("app.title")}
            </span>
          </Link>
        </div>
        <div
          className={`flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-2 sm:space-x-4`}
        >
          {/* Animated Language Toggle */}
          <AnimatedLanguageToggle variant="dropdown" showNames={!isMobile} />

          {/* Notification Bell - available on all screen sizes for authenticated users */}
          {user && <NotificationBell />}

          {/* Only show help button on larger screens */}
          {!isMobile && (
            <Button
              variant="outline"
              size="icon"
              className="text-slate-600 border-slate-200 shadow-sm hover:bg-slate-50"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          )}

          {/* Use new AuthenticationButton component for Replit Auth */}
          <AuthenticationButton />
        </div>
      </div>
    </header>
  );
}