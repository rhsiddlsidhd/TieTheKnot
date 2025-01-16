import axios from "axios";
import { DeleteFormData } from "../../../components/guestbook/GuestBook";

export const deleteGuestBook = async (
  deleteFormData: DeleteFormData
): Promise<{ nickname: string }> => {
  try {
    const res = await axios.delete("http://localhost:8080/book", {
      data: deleteFormData,
    });

    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};
