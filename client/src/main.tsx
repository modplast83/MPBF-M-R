import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
// Import i18n configuration
import "./lib/i18n";
import { LanguageProvider } from "@/hooks/use-language";
import { setupGlobalErrorHandlers } from "./utils/resize-observer-error-handler";
import { setupGlobalErrorHandling } from "./utils/console-error-filter";

// Setup global error handlers to prevent ResizeObserver loop errors
setupGlobalErrorHandlers();

// Setup enhanced console error filtering
setupGlobalErrorHandling();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <App />
      <Toaster />
    </LanguageProvider>
  </QueryClientProvider>,
);
