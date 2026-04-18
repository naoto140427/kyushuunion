"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { cn } from "../lib/utils";
import { YuiLoading } from "./YuiLoading";

type UploadState = "idle" | "dragging" | "loading" | "success" | "error";

interface ParsedEtcData {
  route: string;
  totalCost: number;
}

interface EtcCsvRow {
  "利用年月日（自）"?: string;
  "利用ＩＣ（自）"?: string;
  "利用ＩＣ（至）"?: string;
  "後納料金"?: string;
  [key: string]: any;
}

import { YUI_TRANSITION } from "../lib/utils";
const TARGET_DATE = "26/04/04";

export const EtcUpload: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedEtcData | null>(null);

  const processFile = (file: File) => {
    setUploadState("loading");
    setErrorMessage("");
    setParsedData(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setUploadState("error");
        setErrorMessage("ファイルの読み込みに失敗しました。");
        return;
      }

      Papa.parse<EtcCsvRow>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setTimeout(() => {
            try {
              const data = results.data;
              const targetRows = data.filter(row => row["利用年月日（自）"] === TARGET_DATE);

              if (targetRows.length === 0) {
                setUploadState("error");
                setErrorMessage(`指定された日付（${TARGET_DATE}）のデータが見つかりません。`);
                return;
              }

              let totalCost = 0;
              const routeParts: string[] = [];

              targetRows.forEach(row => {
                const startIC = row["利用ＩＣ（自）"] || "";
                const endIC = row["利用ＩＣ（至）"] || "";
                const costStr = row["後納料金"] || "0";

                if (startIC && endIC) {
                  routeParts.push(`${startIC}〜${endIC}`);
                }

                const cost = parseInt(costStr, 10);
                if (!isNaN(cost)) {
                  totalCost += cost;
                }
              });

              const combinedRoute = routeParts.join("　");

              setParsedData({
                route: combinedRoute,
                totalCost
              });
              setUploadState("success");

            } catch (error) {
              setUploadState("error");
              setErrorMessage("CSVデータの解析中にエラーが発生しました。");
            }
          }, 800);
        },
        error: () => {
          setUploadState("error");
          setErrorMessage("CSVフォーマットが正しくありません。");
        }
      });
    };

    reader.onerror = () => {
      setUploadState("error");
      setErrorMessage("ファイルの読み込み中にエラーが発生しました。");
    };

    reader.readAsText(file, "Shift_JIS");
  };  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState !== "success") {
      setUploadState("dragging");
    }
  }, [uploadState]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState !== "success") {
      setUploadState("idle");
    }
  }, [uploadState]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploadState === "success") return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setUploadState("error");
        setErrorMessage("CSVファイルを選択してください。");
        return;
      }
      processFile(file);
    }
  }, [uploadState]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const resetUpload = () => {
    setUploadState("idle");
    setParsedData(null);
    setErrorMessage("");
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
                {uploadState === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={YUI_TRANSITION}
            className="flex flex-col items-center justify-center w-full min-h-[200px] bg-white/50 backdrop-blur-md rounded-[32px] border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.02)]"
          >
            <YuiLoading />
          </motion.div>
        ) : uploadState === "success" && parsedData ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={YUI_TRANSITION}
            className="bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400 rounded-l-full" />

            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-50 text-emerald-500 p-3 rounded-[20px]">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">読み込み完了</h3>
                <p className="text-sm text-slate-500">ETCの利用履歴を正常に抽出しました</p>
              </div>
            </div>

            <div className="space-y-3 bg-white/50 p-4 rounded-[24px] mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">利用経路 ({TARGET_DATE})</p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {parsedData.route || "経路データなし"}
                </p>
              </div>
              <div className="h-px w-full bg-slate-200/50" />
              <div>
                <p className="text-xs text-slate-400 mb-1">合計金額</p>
                <p className="text-2xl font-bold text-slate-800">
                  ¥{parsedData.totalCost.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={resetUpload}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[20px] text-sm font-medium transition-colors"
            >
              別のファイルを読み込む
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={YUI_TRANSITION}
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center w-full min-h-[200px] p-6 text-center cursor-pointer transition-all duration-300",
                "bg-white/50 backdrop-blur-md rounded-[32px] border-2 border-dashed shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden group",
                uploadState === "dragging"
                  ? "border-pink-400 bg-pink-50/50 scale-[1.02]"
                  : "border-slate-300/50 hover:border-pink-300 hover:bg-white/80"
              )}
            >
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />

              <motion.div
                animate={uploadState === "dragging" ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={YUI_TRANSITION}
                className={cn(
                  "p-4 rounded-[24px] mb-3 transition-colors duration-300",
                  uploadState === "dragging" ? "bg-pink-100 text-pink-500" : "bg-slate-100 text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-400"
                )}
              >
                <UploadCloud size={32} />
              </motion.div>

              <h3 className="text-base font-bold text-slate-700 mb-1">
                ETC CSVファイルをアップロード
              </h3>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                タップしてファイルを選択するか、ここにドラッグ＆ドロップしてください
              </p>

              {uploadState === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-1.5 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-[16px]"
                >
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
