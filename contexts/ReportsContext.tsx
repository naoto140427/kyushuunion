"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useReports } from "../hooks/useReports";
import { Database } from "../types/database.types";

type Report = Database['public']['Tables']['reports']['Row'];

interface ReportsContextType {
  reports: Report[];
  pendingReports: Report[];
  submittedReports: Report[];
  oldestPendingReport: Report | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const reportsData = useReports();
  return (
    <ReportsContext.Provider value={reportsData}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReportsContext must be used within a ReportsProvider");
  }
  return context;
};
