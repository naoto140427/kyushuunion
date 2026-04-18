"use client";

import React, { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Car, Building2, Receipt, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";
import { EtcUpload } from "../components/EtcUpload";

// Types
type TabType = "unsubmitted" | "submitted";

interface HeaderProps {
  title: string;
  subtitle: string;
}

interface ActionCardProps extends HTMLMotionProps<"button"> {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconContainerClassName?: string;
}

interface AlertProps {
  title: string;
  description: string;
  onAction?: () => void;
}

interface NavigationBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// Constants
const SPRING_ANIMATION = { type: "spring" as const, stiffness: 400, damping: 25 };

// Components
const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  // Title with the period colored differently as specified.
  // Assuming the title ends with a period.
  const titleText = title.replace(/\.$/, "");
  const hasPeriod = title.endsWith(".");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 pt-4"
    >
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">
        {titleText}
        {hasPeriod && <span className="text-pink-400">.</span>}
      </h1>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </motion.header>
  );
};

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  iconContainerClassName,
  className,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_ANIMATION}
      className={cn(
        "relative overflow-hidden bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 text-left group",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "p-4 rounded-[24px] group-hover:scale-110 transition-transform duration-300",
          iconContainerClassName
        )}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    </motion.button>
  );
};

const UnsubmittedAlert: React.FC<AlertProps> = ({ title, description, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, ...SPRING_ANIMATION }}
      className="bg-white/70 backdrop-blur-md border border-white/40 p-5 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
    >
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-400 rounded-l-full" />
      <div className="flex justify-between items-center pl-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />
            </span>
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onAction}
          className="bg-slate-700 text-white text-xs px-4 py-2 rounded-[16px] font-medium shadow-sm hover:bg-slate-600 transition-colors"
        >
          処理する
        </motion.button>
      </div>
    </motion.div>
  );
};

const BottomNavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center z-50">
      <div className="bg-white/70 backdrop-blur-md border border-white/40 p-1.5 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex gap-1 w-full max-w-sm">
        <button
          onClick={() => onTabChange("unsubmitted")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[24px] text-sm font-medium transition-all duration-300",
            activeTab === "unsubmitted"
              ? "bg-slate-100 text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-500"
          )}
        >
          <Receipt size={18} />
          未提出
        </button>
        <button
          onClick={() => onTabChange("submitted")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[24px] text-sm font-medium transition-all duration-300",
            activeTab === "submitted"
              ? "bg-slate-100 text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-500"
          )}
        >
          <CheckCircle2 size={18} />
          提出済
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("unsubmitted");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-pink-100 p-6 pb-32">
      <Header title="精算アプリ." subtitle="今日も一日お疲れ様です！" />

      <div className="grid grid-cols-1 gap-5 mb-10">
        <ActionCard
          title="執行委員会用"
          description="開催場所を検索して自動計算"
          icon={<Building2 size={28} />}
          iconContainerClassName="bg-blue-50 text-blue-500"
        />
        <ActionCard
          title="職場訪問用"
          description="複数店舗のルート距離を自動計算"
          icon={<Car size={28} />}
          iconContainerClassName="bg-emerald-50 text-emerald-500"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-bold tracking-tight text-slate-800 mb-4 px-2">
          ETC連携
        </h2>
        <EtcUpload />
      </div>

      <UnsubmittedAlert
        title="未提出の精算があります"
        description="4月4日 執行委員会 (大分宮河内〜熊本)"
      />

      <BottomNavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
