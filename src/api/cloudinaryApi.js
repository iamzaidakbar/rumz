const CLOUD_NAME = "dzpzi0pk2";
const UPLOAD_PRESET = "rumz_upload";

export const cloudinaryApi = {
  async uploadImages(files) {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Cloudinary upload failed: ${errorData.error.message}`
          );
        }

        const data = await response.json();
        return data.secure_url;
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  },
};
