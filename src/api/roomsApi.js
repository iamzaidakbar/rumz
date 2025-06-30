const STORAGE_KEY = "rumz_rooms";

function getInitialRooms() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [
    {
      id: "R101",
      roomNumber: "101",
      floor: "Ground",
      type: "Standard Room",
      status: "Available",
      amenities: ["Wi-Fi", "TV", "AC"],
      photo: "",
    },
    {
      id: "R102",
      roomNumber: "102",
      floor: "Ground",
      type: "Deluxe Suite",
      status: "Occupied",
      amenities: ["Wi-Fi", "TV", "AC", "Mini-bar"],
      photo: "",
    },
  ];
}

function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

export const roomsApi = {
  async fetchRooms() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getInitialRooms());
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
