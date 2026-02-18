"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useContexts } from "@/hooks/useFirestore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: contexts } = useContexts();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="hidden md:flex">
        <Sidebar contexts={contexts} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="hidden md:flex">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
