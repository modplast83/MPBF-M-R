import { createRoot } from "react-dom/client";

function TestApp() {
  return (
    <div>
      <h1>Test App</h1>
      <p>Testing if basic React setup works...</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<TestApp />);