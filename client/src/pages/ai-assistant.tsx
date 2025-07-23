import { AIAssistantWidget } from "@/components/ai/ai-assistant-widget";

export default function AIAssistantPage() {
  return (
    <div className="page-container flex justify-center items-start pt-8">
      <div className="w-full max-w-2xl">
        <AIAssistantWidget className="h-[700px]" />
      </div>
    </div>
  );
}