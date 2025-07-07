import apiClient, { apiRequest } from "./apiClient";
import { apiCache } from "../utils";

const API_BASE = "/api/room";

/**
 * Room API for CRUD operations
 */
export const roomsApi = {
  /**
   * Get all rooms
   * @returns {Promise<Array>} Array of rooms
   */
  async getRooms({ refresh = false } = {}) {
    const cacheKey = "roomsApi:getRooms";
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    try {
      const response = await apiRequest(() => apiClient.get(API_BASE));
      const rooms = response.rooms || response;
      apiCache.set(cacheKey, rooms);
      return rooms;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw new Error("Failed to fetch rooms");
    }
  },

  /**
   * Get a single room by ID
   * @param {string} id - Room ID
   * @returns {Promise<Object>} Room object
   */
  async getRoom(id, { refresh = false } = {}) {
    const cacheKey = `roomsApi:getRoom:${id}`;
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    try {
      if (!id) throw new Error("Room ID is required");
      const response = await apiRequest(() =>
        apiClient.get(`${API_BASE}/${id}`)
      );
      const room = response.room || response;
      apiCache.set(cacheKey, room);
      return room;
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new room
   * @param {Object} room - Room data
   * @returns {Promise<Object>} Created room
   */
  async addRoom(room) {
    try {
      if (!room) throw new Error("Room data is required");
      const response = await apiRequest(() => apiClient.post(API_BASE, room));
      return response.room || response;
    } catch (error) {
      console.error("Error adding room:", error);
      throw error;
    }
  },

  /**
   * Update an existing room
   * @param {string} id - Room ID
   * @param {Object} updates - Updated room data
   * @returns {Promise<Object>} Updated room
   */
  async updateRoom(id, updates) {
    try {
      if (!id) throw new Error("Room ID is required");
      if (!updates || typeof updates !== "object")
        throw new Error("Updates object is required");
      const payload = { ...updates };
      if (payload.roomNumber) payload.room_number = payload.roomNumber;
      delete payload.roomNumber;
      const response = await apiRequest(() =>
        apiClient.put(`${API_BASE}/${id}`, payload)
      );
      return response.room || response;
    } catch (error) {
      console.error(`Error updating room ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a room
   * @param {string} id - Room ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteRoom(id) {
    try {
      if (!id) throw new Error("Room ID is required");
      await apiRequest(() => apiClient.delete(`${API_BASE}/${id}`));
      return true;
    } catch (error) {
      console.error(`Error deleting room ${id}:`, error);
      throw error;
    }
  },
};
