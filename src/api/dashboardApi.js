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
};

export default dashboardApi;
