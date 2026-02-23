"use client";

import { useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Use router.refresh() for a soft refresh that preserves React state
    // Or use window.location.reload() for a full page refresh
    window.location.reload();
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
      title="Refresh"
    >
      <LuRefreshCw
        className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
      />
    </button>
  );
}
