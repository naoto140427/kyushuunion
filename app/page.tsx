"use client";

import { motion } from "framer-motion";
import { Car, Building2, Receipt, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("unsubmitted");

  // アニメーションの共通設定（ぽよんとした動き）
  const springAnim = { type: "spring", stiffness: 400, damping: 25 };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-pink-100 p-6 pb-32">
      {/* ヘッダー部分 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pt-4"
      >
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          精算アプリ <span className="text-pink-400">.</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">今日も一日お疲れ様です！</p>
      </motion.header>

      {/* メインのアクションボタン（執行用 / 職訪用） */}
      <div className="grid grid-cols-1 gap-5 mb-10">
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          transition={springAnim}
          className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 text-left group"
        >
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform duration-300">
            <Building2 size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">執行委員会用</h2>
            <p className="text-xs text-slate-500 mt-1">開催場所を検索して自動計算</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          transition={springAnim}
          className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 text-left group"
        >
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            <Car size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">職場訪問用</h2>
            <p className="text-xs text-slate-500 mt-1">複数店舗のルート距離を自動計算</p>
          </div>
        </motion.button>
      </div>

      {/* 提出ステータス（未提出のアラート） */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, ...springAnim }}
        className="bg-white/60 backdrop-blur-sm border border-pink-100 p-5 rounded-[28px] shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-400 rounded-l-full"></div>
        <div className="flex justify-between items-center pl-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
              未提出の精算があります
            </h3>
            <p className="text-xs text-slate-500 mt-1">4月4日 執行委員会 (大分宮河内〜熊本)</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-medium"
          >
            処理する
          </motion.button>
        </div>
      </motion.div>

      {/* 画面下部のふわふわタブナビゲーション */}
      <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-1.5 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] flex gap-1 w-full max-w-sm">
          <button
            onClick={() => setActiveTab("unsubmitted")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "unsubmitted" ? "bg-slate-100 text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Receipt size={18} />
            未提出
          </button>
          <button
            onClick={() => setActiveTab("submitted")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "submitted" ? "bg-slate-100 text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <CheckCircle2 size={18} />
            提出済
          </button>
        </div>
      </div>
    </div>
  );
}
