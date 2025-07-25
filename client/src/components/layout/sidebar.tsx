import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import { useSidebar } from "@/hooks/use-sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth-v2";
import { usePermissions } from "@/hooks/use-permissions";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  Factory,
  Users,
  BarChart3,
  Package,
  Wrench,
  FileText,
  Shield,
  HelpCircle,
  Search,
  X,
  Bot,
} from "lucide-react";
import companyLogo from "@assets/FactoryLogoHPNGW Green.png";
// import factoryLogo from "@assets/FactoryLogoHPNGW Green.png";

interface SidebarProps {
  onNavItemClick?: () => void;
  isMobile?: boolean;
}

// Icon mapping for modern design
const iconMap: Record<string, any> = {
  dashboard: Home,
  settings: Settings,
  precision_manufacturing: Factory,
  people: Users,
  assessment: BarChart3,
  inventory: Package,
  build: Wrench,
  description: FileText,
  security: Shield,
  help: HelpCircle,
  smart_toy: Bot,
};

export default function Sidebar({
  onNavItemClick,
  isMobile = false,
}: SidebarProps) {
  const [location] = useLocation();
  const { expanded, toggle } = useSidebar();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();

  // Add safety check for permissions provider
  let hasPermission: (module: string) => boolean;
  let isLoading = true;

  try {
    const permissions = usePermissions();
    hasPermission = permissions.hasPermission;
    isLoading = permissions.isLoading;
  } catch (error) {
    // Fallback when permissions provider is not available
    hasPermission = () => true; // Allow all permissions as fallback
    isLoading = false;
  }

  // For storing open state of collapsible menu items
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filter sidebar items based on permissions
  const filterItemsByPermission = (items: any[]) => {
    return items.map((section) => ({
      ...section,
      items: section.items
        .filter((item: any) => {
          // If it's a standalone item, check permission for it
          if (!item.subItems) {
            // Dashboard is always visible
            if (item.title === "Dashboard") return true;
            return hasPermission(item.title);
          }

          // For items with subitems, check if any subitems have permission
          const filteredSubItems = (item.subItems || []).filter(
            (subItem: any) => {
              // For Mix Materials, show if user has permission (administrators can always access)
              if (subItem.title === "Mix Materials") {
                return hasPermission(subItem.title);
              }
              // Check permissions for this item
              return hasPermission(subItem.title);
            },
          );

          // Only keep parent item if there are visible subitems
          return filteredSubItems.length > 0;
        })
        .map((item: any) => {
          // If item has subitems, filter those too
          if (item.subItems) {
            return {
              ...item,
              subItems: item.subItems.filter((subItem: any) => {
                // For Mix Materials, show if user has permission (administrators can always access)
                if (subItem.title === "Mix Materials") {
                  return hasPermission(subItem.title);
                }
                // Check permissions for this item
                return hasPermission(subItem.title);
              }),
            };
          }
          return item;
        }),
    }));
  };

  // Filter sidebar items based on search term
  const filterItemsBySearch = (items: any[]) => {
    if (!searchTerm.trim()) return items;
    
    return items.map((section) => ({
      ...section,
      items: section.items
        .filter((item: any) => {
          // Check if main item matches search
          const itemTitle = t(`sidebar.${item.title.toLowerCase().replace(/ /g, "_")}`);
          const mainMatch = itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
          
          // Check if any subitems match search
          const subItemMatch = item.subItems?.some((subItem: any) => {
            const subItemTitle = t(`sidebar.${subItem.title.toLowerCase().replace(/ /g, "_")}`);
            return subItemTitle.toLowerCase().includes(searchTerm.toLowerCase());
          });
          
          return mainMatch || subItemMatch;
        })
        .map((item: any) => {
          // If item has subitems, filter those based on search too
          if (item.subItems) {
            return {
              ...item,
              subItems: item.subItems.filter((subItem: any) => {
                const subItemTitle = t(`sidebar.${subItem.title.toLowerCase().replace(/ /g, "_")}`);
                return subItemTitle.toLowerCase().includes(searchTerm.toLowerCase());
              }),
            };
          }
          return item;
        }),
    }));
  };

  // Filter sidebar items based on user permissions and search
  const permissionFilteredItems = filterItemsByPermission(SIDEBAR_ITEMS);
  const filteredSidebarItems = filterItemsBySearch(permissionFilteredItems);

  return (
    <aside
      className={cn(
        "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white h-full min-h-screen flex flex-col transition-all duration-300 shadow-2xl overflow-hidden border-slate-700/30",
        expanded ? "w-[280px]" : "w-[80px]",
        isMobile ? "static w-full" : "fixed top-0 z-50",
        !isMobile && (isRTL ? "right-0" : "left-0"),
        isRTL ? "border-l" : "border-r"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header with Logo */}
      <div
        className={`p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm ${isRTL ? "text-right" : "text-left"}`}
      >
        <div className="flex items-center justify-between">
          {expanded ? (
            <div className="flex flex-col items-center w-full space-y-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl ring-2 ring-blue-400/30 backdrop-blur-sm">
                  <img
                    src="https://replit.com/t/modern-plastic-bags-factory/repls/MPBF-M#client/public/assets/company-logo.png"
                    alt="Modern Plastic Bag Factory"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
              </div>
              <div className="text-center">
                <h1 className="text-lg text-white leading-tight font-bold tracking-wide">
                  {t("app.title")}
                </h1>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {t("app.manufacturing_short")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg ring-2 ring-blue-400/30">
                  <img
                    src="https://replit.com/t/modern-plastic-bags-factory/repls/MPBF-M#client/public/assets/company-logo.png"
                    alt="Modern Plastic Bag Factory"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        {!isMobile && (
          <Button
            onClick={toggle}
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-4 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full",
              isRTL ? "left-4" : "right-4",
              expanded ? "translate-y-0" : "translate-y-2",
            )}
          >
            {expanded ? (
              isRTL ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            ) : isRTL ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {/* Search Bar */}
      {expanded && (
        <div className="px-4 py-3 border-b border-slate-700/50">
          <div className="relative">
            <div className={cn(
              "absolute inset-y-0 flex items-center pointer-events-none transition-all duration-200",
              isSearchFocused ? "text-blue-400" : "text-slate-400",
              isRTL ? "right-0 pr-3" : "left-0 pl-3"
            )}>
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="text"
              placeholder={t("sidebar.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "py-2 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:bg-slate-800/80 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 rounded-lg",
                isSearchFocused && "shadow-lg shadow-blue-500/20",
                isRTL ? "pr-10 pl-8" : "pl-10 pr-8"
              )}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={cn(
                  "absolute inset-y-0 flex items-center text-slate-400 hover:text-white transition-colors duration-200",
                  isRTL ? "left-0 pl-3" : "right-0 pr-3"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto sidebar-scrollbar">
        {filteredSidebarItems.map(
          (section, sectionIndex) =>
            section.items.length > 0 && (
              <div key={sectionIndex} className="space-y-2">
                {expanded && (
                  <div className={cn(
                    "px-3 py-2 text-slate-400 uppercase tracking-widest text-xs font-bold border-b border-slate-700/30 mb-3",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {t(`sidebar.${section.title.toLowerCase()}`)}
                  </div>
                )}

                {section.items.map((item: any, itemIndex: number) => {
                  const IconComponent = iconMap[item.icon] || Home;

                  return (
                    <div key={itemIndex}>
                      {item.subItems ? (
                        <Collapsible
                          defaultOpen={false}
                          open={openMenus[item.title] === undefined ? false : openMenus[item.title]}
                          onOpenChange={() => toggleMenu(item.title)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-indigo-600/20 transition-all duration-300 group rounded-lg h-11 font-medium",
                                isRTL && "flex-row-reverse",
                                isActive(item.path) &&
                                  cn(
                                    "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white shadow-lg",
                                    isRTL ? "border-r-3 border-blue-400" : "border-l-3 border-blue-400"
                                  ),
                              )}
                            >
                              <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300",
                                expanded && !isRTL && "mr-3",
                                expanded && isRTL && "ml-3",
                              )}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              {expanded && (
                                <>
                                  <span className={cn(
                                    "flex-1 text-sm",
                                    isRTL ? "text-right" : "text-left"
                                  )}>
                                    {t(
                                      `sidebar.${item.title.toLowerCase().replace(/ /g, "_")}`,
                                    )}
                                  </span>
                                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                                    {openMenus[item.title] ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight
                                        className={cn(
                                          "h-3 w-3",
                                          isRTL && "rotate-180",
                                        )}
                                      />
                                    )}
                                  </div>
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="space-y-1 mt-2">
                            {item.subItems.map(
                              (subItem: any, subIndex: number) => (
                                <Link key={subIndex} href={subItem.path}>
                                  <Button
                                    variant="ghost"
                                    onClick={onNavItemClick}
                                    className={cn(
                                      "group inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group w-full justify-start hover:text-white hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-slate-600/30 transition-all duration-300 rounded-lg h-10 text-center flex-row-reverse bg-gradient-to-r from-blue-600/40 to-indigo-600/40 text-blue-200 shadow-md border-r-3 border-blue-400 ml-[0px] mr-[0px]",
                                      isRTL && "flex-row-reverse",
                                      isActive(subItem.path) &&
                                        cn(
                                          "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 text-blue-200 shadow-md",
                                          isRTL ? "border-r-3 border-blue-400" : "border-l-3 border-blue-400"
                                        ),
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 shadow-sm",
                                        expanded && !isRTL && "mr-3",
                                        expanded && isRTL && "ml-3",
                                      )}
                                    />
                                    {expanded && (
                                      <span className={cn(
                                        "text-sm font-medium",
                                        isRTL ? "text-right" : "text-left"
                                      )}>
                                        {t(
                                          `sidebar.${subItem.title.toLowerCase().replace(/ /g, "_")}`,
                                        )}
                                      </span>
                                    )}
                                  </Button>
                                </Link>
                              ),
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Link href={item.path}>
                          <Button
                            variant="ghost"
                            onClick={onNavItemClick}
                            className={cn(
                              "w-full justify-start text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-indigo-600/20 transition-all duration-300 group rounded-lg h-11 font-medium",
                              isRTL && "flex-row-reverse",
                              isActive(item.path) &&
                                cn(
                                  "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white shadow-lg",
                                  isRTL ? "border-r-3 border-blue-400" : "border-l-3 border-blue-400"
                                ),
                            )}
                          >
                            <div className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300",
                              expanded && !isRTL && "mr-3",
                              expanded && isRTL && "ml-3",
                            )}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            {expanded && (
                              <span className={cn(
                                "text-sm font-medium",
                                isRTL ? "text-right" : "text-left"
                              )}>
                                {t(
                                  `sidebar.${item.title.toLowerCase().replace(/ /g, "_")}`,
                                )}
                              </span>
                            )}
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ),
        )}
      </nav>
      {/* User Info & Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        {expanded ? (
          <div className="space-y-3">
            {/* User Profile */}
            <div className={cn(
              "flex items-center p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition-all duration-300",
              isRTL ? "space-x-reverse space-x-3" : "space-x-3"
            )}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.isAdmin ? t('sidebar.admin') : t('sidebar.user')}
                </p>
              </div>
            </div>
            
            {/* Footer Info */}
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">Version 2.0</p>
              <p className="text-xs text-slate-500">
                © 2025 Modern Plastic
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="w-8 h-1 bg-slate-600 rounded-full"></div>
          </div>
        )}
      </div>
    </aside>
  );
}
