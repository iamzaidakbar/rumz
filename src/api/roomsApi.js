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
      photo:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      beds: 1,
      bathrooms: 1,
      description:
        "This cozy room features a comfortable queen-sized bed, a private bathroom, and a work desk. Perfect for solo travelers or couples.",
      price: 120,
    },
    {
      id: "R102",
      roomNumber: "102",
      floor: "Ground",
      type: "Deluxe Suite",
      status: "Occupied",
      amenities: ["Wi-Fi", "TV", "AC", "Mini-bar"],
      photo:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      beds: 2,
      bathrooms: 2,
      description:
        "A spacious suite with a king-sized bed, a separate living area, and a luxurious bathroom with a bathtub. Ideal for a lavish stay.",
      price: 250,
    },
  ];
}

function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

export const roomsApi = {
  async getRooms() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getInitialRooms());
      }, 300);
    });
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
