import apiClient, { apiRequest } from "./apiClient";

const STORAGE_KEY = "rumz_rooms";

function getInitialRooms() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [];
}

function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

export async function fetchRooms() {
  try {
    const response = await apiRequest(() => apiClient.get("/api/room"));
    return response.rooms || [];
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw error;
  }
}

export const roomsApi = {
  async getRooms() {
    return fetchRooms();
  },
  async getRoom(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rooms = getInitialRooms();
        const room = rooms.find((r) => r.id === id);
        if (room) {
          resolve(room);
        } else {
          reject(new Error("Room not found"));
        }
      }, 300);
    });
  },
  async addRoom(room) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = getInitialRooms();
        const newRoom = { ...room, id: `R${Date.now()}` };
        rooms.push(newRoom);
        saveRooms(rooms);
        resolve(newRoom);
      }, 300);
    });
  },
  async updateRoom(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let rooms = getInitialRooms();
        rooms = rooms.map((r) => (r.id === id ? { ...r, ...updates } : r));
        saveRooms(rooms);
        resolve(rooms.find((r) => r.id === id));
      }, 300);
    });
  },
  async deleteRoom(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let rooms = getInitialRooms();
        rooms = rooms.filter((r) => r.id !== id);
        saveRooms(rooms);
        resolve(true);
      }, 300);
    });
  },
};
