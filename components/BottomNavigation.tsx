"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History } from "lucide-react";
import { cn } from "../lib/utils";

interface BottomNavigationProps {
  unsubmittedCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ unsubmittedCount = 0 }) => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center z-50">
      <div className="bg-white/70 backdrop-blur-md border border-white/40 p-1.5 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex gap-1 w-full max-w-sm">
        <Link
          href="/"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[24px] text-sm font-medium transition-all duration-300 relative",
            pathname === "/"
              ? "bg-slate-100 text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-500"
          )}
        >
          <Home size={18} />
          ホーム
          {unsubmittedCount > 0 && (
            <span className="bg-pink-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {unsubmittedCount}
            </span>
          )}
        </Link>
        <Link
          href="/history"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[24px] text-sm font-medium transition-all duration-300",
            pathname === "/history"
              ? "bg-slate-100 text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-500"
          )}
        >
          <History size={18} />
          履歴
        </Link>
      </div>
    </div>
  );
};
