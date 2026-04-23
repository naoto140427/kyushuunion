"use client";

import React from "react";
import { BottomNavigation } from "./BottomNavigation";
import { useReportsContext } from "../contexts/ReportsContext";

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pendingReports } = useReportsContext();
  return (
    <>
      {children}
      <BottomNavigation unsubmittedCount={pendingReports.length} />
    </>
  );
};
