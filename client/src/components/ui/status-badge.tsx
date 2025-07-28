import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const getStatusInfo = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          classes: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: "hourglass_empty",
        };
      case "processing":
        return {
          classes: "bg-blue-100 text-blue-800 border-blue-300",
          icon: "sync",
        };
      case "completed":
        return {
          classes: "bg-green-100 text-green-800 border-green-300",
          icon: "check_circle",
        };
      case "cancelled":
      case "rejected":
        return {
          classes: "bg-red-100 text-red-800 border-red-300",
          icon: "cancel",
        };
      case "extrusion":
        return {
          classes: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: "view_in_ar",
        };
      case "printing":
        return {
          classes: "bg-amber-50 text-amber-700 border-amber-200",
          icon: "print",
        };
      case "cutting":
        return {
          classes: "bg-cyan-50 text-cyan-700 border-cyan-200",
          icon: "content_cut",
        };
      case "hold":
        return {
          classes: "bg-orange-100 text-orange-800 border-orange-300",
          icon: "pause_circle",
        };
      case "in stock":
        return {
          classes: "bg-purple-50 text-purple-700 border-purple-200",
          icon: "inventory_2",
        };
      default:
        return {
          classes: "bg-gray-50 text-gray-700 border-gray-200",
          icon: "help_outline",
        };
    }
  };

  const { classes, icon } = getStatusInfo();

  // Get translated status text, fallback to capitalized status if no translation
  const getTranslatedStatus = () => {
    const translationKey = `status.${status.toLowerCase()}`;
    const translated = t(translationKey);

    // If translation returns the same as the key, it means no translation exists
    if (translated === translationKey) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }

    return translated;
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap",
        classes,
        className,
      )}
    >
      <span className="material-icons text-[13px]">{icon}</span>
      {getTranslatedStatus()}
    </span>
  );
}
