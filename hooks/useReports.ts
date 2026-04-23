import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";

type Report = Database['public']['Tables']['reports']['Row'];

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('date', { ascending: true }); // Oldest first

      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }

      if (data) {
        setReports(data);
      }
    } catch (err) {
      console.error("Unexpected error during fetch:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const submittedReports = reports.filter(r => r.status === 'submitted');
  const oldestPendingReport = pendingReports.length > 0 ? pendingReports[0] : null;

  return {
    reports,
    pendingReports,
    submittedReports,
    oldestPendingReport,
    isLoading,
    refetch: fetchReports
  };
}
