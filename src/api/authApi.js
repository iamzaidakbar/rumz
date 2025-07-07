import apiClient, { apiRequest } from "./apiClient";
import { apiCache } from "../utils";

export const validateToken = async (token, { refresh = false } = {}) => {
  if (!refresh) {
    const cached = apiCache.get(`validateToken:${token}`);
    if (cached) return cached;
  }
  const result = await apiRequest(() =>
    apiClient.post(
      "/api/validate-token",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
  apiCache.set(`validateToken:${token}`, result);
  return result;
};
