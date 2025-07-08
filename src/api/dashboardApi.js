import apiClient, { apiRequest } from "./apiClient";
import { apiCache } from "../utils";

export const dashboardApi = {
  /**
   * Get dashboard summary
   * @param {Object} options - { refresh: boolean }
   * @returns {Promise<Object>} Dashboard summary data
   */
  async getSummary({ refresh = false } = {}) {
    const cacheKey = "dashboardApi:getSummary";
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    const response = await apiRequest(() => apiClient.get("/api/summary"));
    apiCache.set(cacheKey, response);
    return response;
  },
  /**
   * Get revenue trend
   * @param {Object} options - { period, year, refresh }
   * @returns {Promise<Array>} Revenue trend data
   */
  async getRevenueTrend({
    period = "month",
    year = new Date().getFullYear(),
    refresh = false,
  } = {}) {
    const cacheKey = `dashboardApi:getRevenueTrend:${period}:${year}`;
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    const response = await apiRequest(() =>
      apiClient.get("/api/revenue-trend", {
        params: { period, year },
      })
    );
    apiCache.set(cacheKey, response);
    return response;
  },
};

export default dashboardApi;
