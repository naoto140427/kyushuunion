"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn, EASE_TRANSITION } from "../../lib/utils";

interface AlertProps {
  title: string;
  description: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export const UnsubmittedAlert: React.FC<AlertProps> = ({ title, description, onAction, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: 0.2, ...EASE_TRANSITION }}
      className="bg-white/70 backdrop-blur-md border border-white/40 p-5 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-alert rounded-l-full" />
      <div className="flex justify-between items-center pl-2">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alert opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-alert" />
            </span>
            {title}
          </h3>
          <p className="text-xs text-subtle mt-1">{description}</p>
        </div>
        <motion.button
          whileTap={!isLoading ? { scale: 0.9 } : {}}
          onClick={isLoading ? undefined : onAction}
          disabled={isLoading}
          className="bg-accent text-white text-xs px-4 py-2 rounded-[14px] font-medium shadow-sm hover:bg-accent-dark transition-colors disabled:opacity-80 flex items-center justify-center min-w-[80px]"
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
