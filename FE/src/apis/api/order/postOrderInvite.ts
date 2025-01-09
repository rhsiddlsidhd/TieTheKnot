import axios from "axios";
import authInstance from "../../utils/instanceOfAuth";

export const postOrderInvite = async (data: any) => {
  try {
    const res = await authInstance.post("/order", data);

    return res.data;
  } catch (error) {
    throw error;
  }
};
