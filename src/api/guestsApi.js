const STORAGE_KEY = "rumz_guests";

function getInitialGuests() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [];
}

function saveGuests(guests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

export const guestsApi = {
  async getGuests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getInitialGuests());
      }, 300);
    });
  },

  async addGuest(guest) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const guests = getInitialGuests();
        const newGuest = { ...guest, id: Date.now() };
        guests.push(newGuest);
        saveGuests(guests);
        resolve(newGuest);
      }, 300);
    });
  },

  async updateGuest(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let guests = getInitialGuests();
        guests = guests.map((g) => (g.id === id ? { ...g, ...updates } : g));
        saveGuests(guests);
        resolve(guests.find((g) => g.id === id));
      }, 300);
    });
  },

  async deleteGuest(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let guests = getInitialGuests();
        guests = guests.filter((g) => g.id !== id);
        saveGuests(guests);
        resolve(true);
      }, 300);
    });
  },

  async getGuest(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const guests = getInitialGuests();
        const guest = guests.find((g) => g.id === id);
        if (guest) {
          resolve(guest);
        } else {
          reject(new Error("Guest not found"));
        }
      }, 300);
    });
  },
};
