import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { ToastProvider } from "@/context/ToastContext.jsx";
import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { NotificationProvider } from "@/context/NotificationContext.jsx";
import App from "@/App.jsx";
import "@/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
