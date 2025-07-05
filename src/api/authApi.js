import apiClient, { apiRequest } from "./apiClient";

export const validateToken = async (token) => {
  return apiRequest(() =>
    apiClient.post(
      "/api/validate-token",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
};
