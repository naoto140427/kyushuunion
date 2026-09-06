"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, CheckCircle2, Download } from "lucide-react";
import { Header } from "../../components/ui/Header";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useReportsContext } from "../../contexts/ReportsContext";
import { cn } from "../../lib/utils";
import { Database } from "../../types/database.types";
import { supabase } from "../../lib/supabase";

type TabType = "pending" | "submitted";
type Report = Database['public']['Tables']['reports']['Row'];

export default function HistoryPage() {
  const { reports, pendingReports, submittedReports, isLoading, refetch } = useReportsContext();
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const formatReportDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getReportTypeLabel = (type: string) => {
    return type === 'shikko' ? '執行委員会' : '職場訪問';
  };

  const getDestinationsPreview = (destinations: any) => {
    if (!destinations) return '';
    if (typeof destinations === 'string') return destinations;
    if (Array.isArray(destinations)) return destinations.join('〜');
    return JSON.stringify(destinations);
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'submitted') => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (err) {
      console.error(err);
      alert("ステータスの更新に失敗しました");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadExcel = async (reportData: Report) => {
    try {
      setDownloadingId(reportData.id);
      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) throw new Error('ダウンロードに失敗しました');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `精算書_${getDestinationsPreview(reportData.destinations) || '出力'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Excelの生成に失敗しました');
    } finally {
      setDownloadingId(null);
    }
  };


  const currentReports = activeTab === "pending" ? pendingReports : submittedReports;

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent-light p-6 pb-32">
      <Header title="履歴." subtitle="過去の申請状況を確認できます" />

      <div className="flex bg-ink/5 p-1 rounded-full mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-full transition-all flex items-center justify-center gap-2",
            activeTab === "pending" ? "bg-white text-ink shadow-sm" : "text-subtle"
          )}
        >
          <Receipt size={16} />
          未提出 ({pendingReports.length})
        </button>
        <button
          onClick={() => setActiveTab("submitted")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-full transition-all flex items-center justify-center gap-2",
            activeTab === "submitted" ? "bg-white text-ink shadow-sm" : "text-subtle"
          )}
        >
          <CheckCircle2 size={16} />
          提出済 ({submittedReports.length})
        </button>
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
            <LoadingSpinner />
          </motion.div>
        ) : currentReports.length > 0 ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {currentReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-md border border-white/40 p-5 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
              >
                <div className={cn("absolute top-0 left-0 w-1.5 h-full rounded-l-full", activeTab === 'pending' ? 'bg-alert' : 'bg-ink/20')} />

                <div className="flex justify-between items-start pl-2 mb-3">
                  <div>
                    <span className="text-xs font-bold text-subtle uppercase tracking-wider">{formatReportDate(report.date)}</span>
                    <h3 className="text-base font-bold text-ink mt-1">{getReportTypeLabel(report.type)}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-subtle uppercase tracking-wider">交通費</span>
                    <p className="text-sm font-bold text-accent">¥{report.travel_allowance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pl-2 mb-4">
                  <p className="text-sm text-ink/70 line-clamp-1">{getDestinationsPreview(report.destinations)}</p>
                </div>

                <div className="pl-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleDownloadExcel(report)}
                    disabled={downloadingId === report.id}
                    className="w-full bg-accent-light text-accent border border-accent/10 text-xs px-4 py-3 rounded-[14px] font-bold shadow-sm hover:bg-accent/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {downloadingId === report.id ? (
                      <LoadingSpinner className="scale-50 h-4" />
                    ) : (
                      <>
                        <Download size={16} />
                        精算書ダウンロード
                      </>
                    )}
                  </button>
                  <div className="flex justify-end">
                    {activeTab === 'pending' ? (
                      <button
                        onClick={() => handleStatusChange(report.id, 'submitted')}
                        disabled={updatingId === report.id}
                        className="bg-accent text-white text-xs px-4 py-2 rounded-[14px] font-medium shadow-sm hover:bg-accent-dark transition-colors disabled:opacity-50"
                      >
                        {updatingId === report.id ? "更新中..." : "提出済みにする"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(report.id, 'pending')}
                        disabled={updatingId === report.id}
                        className="bg-ink/5 text-subtle text-xs px-4 py-2 rounded-[14px] font-medium hover:bg-ink/10 transition-colors disabled:opacity-50"
                      >
                        {updatingId === report.id ? "更新中..." : "未提出に戻す"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-10"
          >
            <p className="text-sm text-subtle font-medium">データがありません</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
