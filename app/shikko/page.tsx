"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { LocationInput } from "../../components/LocationInput";
import { EtcUpload } from "../../components/EtcUpload";
import { YuiLoading } from "../../components/YuiLoading";
import { supabase } from "../../lib/supabase";
import { useReportsContext } from "../../contexts/ReportsContext";

export default function ShikkoPage() {
  const router = useRouter();
  const [locationData, setLocationData] = useState<{ destination: string; distance: number; allowance: number } | null>(null);
  const [etcData, setEtcData] = useState<{ route: string; totalCost: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refetch } = useReportsContext();

  const handleSubmitReport = async () => {
    if (!locationData) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reports').insert({
        type: 'shikko',
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
      await refetch();
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-pink-100 p-6 pb-32">
      <header className="mb-8 pt-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            執行委員会用<span className="text-pink-400">.</span>
          </h1>
        </div>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-bold tracking-tight text-slate-800 mb-4 px-2">目的地検索</h2>
          <LocationInput onLocationCalculated={setLocationData} />
        </section>

        <section>
          <h2 className="text-lg font-bold tracking-tight text-slate-800 mb-4 px-2">ETC連携</h2>
          <EtcUpload onDataParsed={setEtcData} />
        </section>

        <AnimatePresence>
          {locationData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="w-full mt-6 bg-slate-800 text-white font-bold py-4 rounded-[24px] shadow-lg flex justify-center items-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <YuiLoading className="scale-50" /> : "この内容で申請を作成する"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
