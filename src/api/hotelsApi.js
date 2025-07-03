import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const hotelsApi = {
  async registerHotel(hotelData) {
    try {
      const response = await axios.post(`${BASE_URL}/api/signin`, hotelData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      // Axios error handling
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Something went wrong");
    }
  },
};
