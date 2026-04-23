"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Building2, Receipt } from "lucide-react";
import { Header } from "../components/ui/Header";
import { ActionCard } from "../components/ui/ActionCard";
import { UnsubmittedAlert } from "../components/ui/UnsubmittedAlert";
import { YuiLoading } from "../components/YuiLoading";
import { useReportsContext } from "../contexts/ReportsContext";

export default function Home() {
  const router = useRouter();
  const { oldestPendingReport, isLoading } = useReportsContext();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadExcel = async () => {
    if (!oldestPendingReport) return;

    try {
      setIsDownloading(true);

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
          onClick={() => router.push("/shikko")}
          title="執行委員会用"
          description="開催場所を検索して自動計算"
          icon={<Building2 size={28} />}
          iconContainerClassName="bg-blue-50 text-blue-500"
        />

        <ActionCard
          onClick={() => router.push("/shokuho")}
          title="職場訪問用"
          description="複数店舗のルート距離を自動計算"
          icon={<Car size={28} />}
          iconContainerClassName="bg-emerald-50 text-emerald-500"
        />

        <ActionCard
          onClick={() => router.push("/history")}
          title="履歴管理"
          description="過去の申請状況と提出管理"
          icon={<Receipt size={28} />}
          iconContainerClassName="bg-slate-50 text-slate-500"
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
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
    </div>
  );
}
