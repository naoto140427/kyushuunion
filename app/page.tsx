"use client";

import React, { useState, useEffect } from "react";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { Car, Building2, Receipt, CheckCircle2 } from "lucide-react";
import { cn, YUI_TRANSITION } from "../lib/utils";
import { EtcUpload } from "../components/EtcUpload";
import { LocationInput } from "../components/LocationInput";
import { YuiLoading } from "../components/YuiLoading";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";

// Types
type TabType = "unsubmitted" | "submitted";
type Report = Database['public']['Tables']['reports']['Row'];

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
  isLoading?: boolean;
}

interface NavigationBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unsubmittedCount: number;
  submittedCount: number;
}

// Components
const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
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
      transition={YUI_TRANSITION}
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

const UnsubmittedAlert: React.FC<AlertProps> = ({ title, description, onAction, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: 0.2, ...YUI_TRANSITION }}
      className="bg-white/70 backdrop-blur-md border border-white/40 p-5 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
    >
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
          whileTap={!isLoading ? { scale: 0.9 } : {}}
          onClick={isLoading ? undefined : onAction}
          disabled={isLoading}
          className="bg-slate-700 text-white text-xs px-4 py-2 rounded-[16px] font-medium shadow-sm hover:bg-slate-600 transition-colors disabled:opacity-80 flex items-center justify-center min-w-[80px]"
        >
          {isLoading ? (
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          ) : (
            "処理する"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const BottomNavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange, unsubmittedCount, submittedCount }) => {
  return (
    <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center z-50">
      <div className="bg-white/70 backdrop-blur-md border border-white/40 p-1.5 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex gap-1 w-full max-w-sm">
        <button
          onClick={() => onTabChange("unsubmitted")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[24px] text-sm font-medium transition-all duration-300 relative",
            activeTab === "unsubmitted"
              ? "bg-slate-100 text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-500"
          )}
        >
          <Receipt size={18} />
          未提出
          {unsubmittedCount > 0 && (
            <span className="bg-pink-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {unsubmittedCount}
            </span>
          )}
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
          {submittedCount > 0 && (
            <span className="bg-slate-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {submittedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("unsubmitted");
  const [isDownloading, setIsDownloading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [locationData, setLocationData] = useState<{ destination: string; distance: number; allowance: number } | null>(null);
  const [etcData, setEtcData] = useState<{ route: string; totalCost: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAction, setActiveAction] = useState<"shikko" | "shokuho" | null>(null);

  const handleSubmitReport = async () => {
    if (!locationData) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reports').insert({
        type: activeAction || 'shikko',
        date: new Date().toISOString().split('T')[0],
        destinations: locationData.destination,
        total_distance: locationData.distance,
        travel_allowance: locationData.allowance,
        etc_fee: etcData ? etcData.totalCost : 0,
        holiday_allowance: 0,
        status: 'pending'
      });

      if (error) throw error;

      alert("申請を保存しました");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('date', { ascending: true }); // Oldest first

        if (error) {
          console.error("Error fetching reports:", error);
          return;
        }

        if (data) {
          setReports(data);
        }
      } catch (err) {
        console.error("Unexpected error during fetch:", err);
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const submittedReports = reports.filter(r => r.status === 'submitted');
  const oldestPendingReport = pendingReports.length > 0 ? pendingReports[0] : null;

  const handleDownloadExcel = async () => {
    if (!oldestPendingReport) return;

    try {
      setIsDownloading(true);

      // Attempt to extract string representation of destinations
      let destinationsStr = "";
      if (oldestPendingReport.destinations) {
        if (typeof oldestPendingReport.destinations === 'string') {
          destinationsStr = oldestPendingReport.destinations;
        } else if (Array.isArray(oldestPendingReport.destinations)) {
          destinationsStr = oldestPendingReport.destinations.join('〜');
        } else {
          destinationsStr = JSON.stringify(oldestPendingReport.destinations);
        }
      }

      const res = await fetch("/api/export-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: oldestPendingReport.type,
          date: oldestPendingReport.date,
          destinations: destinationsStr,
          totalDistance: oldestPendingReport.total_distance,
          etcFee: oldestPendingReport.etc_fee,
          holidayAllowance: oldestPendingReport.holiday_allowance,
        }),
      });

      if (!res.ok) throw new Error("Failed to export Excel");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "seisan.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Error:", error);
      alert("ダウンロードに失敗しました");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatReportDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getReportTypeLabel = (type: string) => {
    return type === 'shikko' ? '執行委員会' : '職場訪問';
  };

  const getDestinationsPreview = (destinations: any) => {
    if (!destinations) return '';
    if (typeof destinations === 'string') return ` (${destinations})`;
    if (Array.isArray(destinations)) return ` (${destinations.join('〜')})`;
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-pink-100 p-6 pb-32">
      <Header title="精算アプリ." subtitle="今日も一日お疲れ様です！" />

      <div className="grid grid-cols-1 gap-5 mb-10">
        <ActionCard
          onClick={() => setActiveAction("shikko")}
          title="執行委員会用"
          description="開催場所を検索して自動計算"
          icon={<Building2 size={28} />}
          iconContainerClassName="bg-blue-50 text-blue-500"
        />
        <ActionCard
          onClick={() => setActiveAction("shokuho")}
          title="職場訪問用"
          description="複数店舗のルート距離を自動計算"
          icon={<Car size={28} />}
          iconContainerClassName="bg-emerald-50 text-emerald-500"
        />
      </div>


      <AnimatePresence mode="wait">
        {activeAction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <h2 className="text-lg font-bold tracking-tight text-slate-800 mb-4 px-2">
              {activeAction === 'shikko' ? '執行委員会用' : '職場訪問用'} - 目的地検索
            </h2>
            <LocationInput onLocationCalculated={setLocationData} />

            {locationData && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="w-full mt-6 bg-slate-800 text-white font-bold py-4 rounded-[24px] shadow-lg flex justify-center items-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <YuiLoading className="scale-50" /> : "この内容で申請を作成する"}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10">
        <h2 className="text-lg font-bold tracking-tight text-slate-800 mb-4 px-2">
          ETC連携
        </h2>
        <EtcUpload onDataParsed={setEtcData} />
      </div>

      <AnimatePresence mode="wait">
        {isLoadingReports ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 flex justify-center"
          >
            <YuiLoading />
          </motion.div>
        ) : oldestPendingReport ? (
          <UnsubmittedAlert
            key="alert"
            title="未提出の精算があります"
            description={`${formatReportDate(oldestPendingReport.date)} ${getReportTypeLabel(oldestPendingReport.type)}${getDestinationsPreview(oldestPendingReport.destinations)}`}
            onAction={handleDownloadExcel}
            isLoading={isDownloading}
          />
        ) : (
          <motion.div
            key="no-alert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <p className="text-sm text-slate-400 font-medium">未提出の精算はありません ✨</p>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unsubmittedCount={pendingReports.length}
        submittedCount={submittedReports.length}
      />
    </div>
  );
}
