"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import PWAUpdatePrompt from "@/components/ui/PWAUpdatePrompt";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
          <PWAUpdatePrompt />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
