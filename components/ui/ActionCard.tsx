"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn, YUI_TRANSITION } from "../../lib/utils";

interface ActionCardProps extends HTMLMotionProps<"button"> {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconContainerClassName?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
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
