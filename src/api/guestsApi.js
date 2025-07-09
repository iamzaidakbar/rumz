import apiClient, { apiRequest } from "./apiClient";
import { apiCache, delay } from "../utils";

const DELAY_MS = 300;

/**
 * Guests API for CRUD operations (backend)
 */
export const guestsApi = {
  /**
   * Get all guests
   * @returns {Promise<Array>} Array of guests
   */
  async getGuests({ refresh = false } = {}) {
    const cacheKey = "guestsApi:getGuests";
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    try {
      await delay(DELAY_MS);
      const response = await apiRequest(() => apiClient.get("/api/guests"));
      const guests = response.guests || response;
      apiCache.set(cacheKey, guests);
      return guests;
    } catch (error) {
      console.error("Error fetching guests:", error);
      throw new Error("Failed to fetch guests");
    }
  },

  /**
   * Get a single guest by ID
   * @param {string|number} id - Guest ID
   * @returns {Promise<Object>} Guest object
   */
  async getGuest(id, { refresh = false } = {}) {
    const cacheKey = `guestsApi:getGuest:${id}`;
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    try {
      if (!id) throw new Error("Guest ID is required");
      await delay(DELAY_MS);
      const response = await apiRequest(() =>
        apiClient.get(`/api/booking/guest/${id}`)
      );
      const guest = response.guest || response;
      apiCache.set(cacheKey, guest);
      return guest;
    } catch (error) {
      console.error(`Error fetching guest ${id}:`, error);
      throw error;
    }
  },
};
