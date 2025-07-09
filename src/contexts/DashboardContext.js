import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { dashboardApi } from "../api/dashboardApi";
import { useAppContext } from "./AppContext";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { appData } = useAppContext();
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
    if (appData) {
      fetchDashboard();
    }
  }, [fetchDashboard, appData]);

  return (
    <DashboardContext.Provider
      value={{ summary, revenueTrend, loading, fetchDashboard }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
