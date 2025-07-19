import { createRoot } from "react-dom/client";

function SimpleApp() {
  return (
    <div>
      <h1>Production Management System</h1>
      <p>Application is starting...</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<SimpleApp />);