"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const titleText = title.replace(/\.$/, "");
  const hasPeriod = title.endsWith(".");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 pt-4"
    >
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        {titleText}
        {hasPeriod && <span className="text-accent">.</span>}
      </h1>
      <p className="text-sm text-subtle mt-1">{subtitle}</p>
    </motion.header>
  );
};
