import apiClient, { apiRequest } from "./apiClient";

export const hotelsApi = {
  async registerHotel(hotelData) {
    return apiRequest(() => apiClient.post("/api/signin", hotelData));
  },

  async loginHotel(loginData) {
    return apiRequest(() => apiClient.post("/api/login", loginData));
  },

  async updateHotel(hotelRegNo, updateData) {
    return apiRequest(() =>
      apiClient.put(`/api/hotel/${hotelRegNo}`, updateData)
    );
  },
};
