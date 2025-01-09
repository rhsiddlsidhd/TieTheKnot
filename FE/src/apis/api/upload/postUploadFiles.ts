import authInstance from "../../utils/instanceOfAuth";

export const postUploadFiles = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("photos", file);
    const res = await authInstance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { fileUrl } = res.data;

    return fileUrl;
  } catch (error) {
    throw error;
  }
};
