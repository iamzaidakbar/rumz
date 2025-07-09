import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { dashboardApi } from "../api/dashboardApi";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    try {
      const [summaryData, trendData] = await Promise.all([
        dashboardApi.getSummary({ refresh }),
        dashboardApi.getRevenueTrend({ period: "month", refresh }),
      ]);
      setSummary(summaryData);
      setRevenueTrend(trendData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <DashboardContext.Provider
      value={{ summary, revenueTrend, loading, fetchDashboard }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
