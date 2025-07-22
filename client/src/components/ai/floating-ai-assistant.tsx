import { useState } from "react";
import { AIAssistantWidget } from "./ai-assistant-widget";
import { cn } from "@/lib/utils";

interface FloatingAIAssistantProps {
  className?: string;
}

export function FloatingAIAssistant({ className }: FloatingAIAssistantProps) {
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <AIAssistantWidget
        minimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        className={isMinimized ? "" : "shadow-2xl border"}
      />
    </div>
  );
}