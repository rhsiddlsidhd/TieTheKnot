import { Types } from "mongoose";
import DetailInfoModel from "./../models/detailInfoSchema";
import { CustomError } from "../controller/oauthController";

interface DetailInfoPayload {
  weddingAddress: string;
  weddingDate: string;
  isAccount: boolean;
  parents: boolean;
}

class DetailInfoService {
  updateUserInfo = async (
    userId: Types.ObjectId,
    payload: DetailInfoPayload
  ): Promise<DetailInfoPayload> => {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error(`Invaild ${userId}`);
      }

      const { weddingAddress, weddingDate, isAccount, parents } = payload;

      const data = await DetailInfoModel.findOneAndUpdate(
        { user: userId },
        { weddingAddress, weddingDate, isAccount, parents },
        { new: true }
      ).select("-__v -_id -user");

      if (!data) {
        throw new CustomError(404, "Data not found");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };
  findDetailInfoByUserId = async (
    userId: Types.ObjectId
  ): Promise<DetailInfoPayload> => {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError(400, `Invaild ${userId}`);
    }

    const data = await DetailInfoModel.findOne({ user: userId }).select(
      "-__v -_id -user"
    );
    if (!data) {
      throw new CustomError(404, "Data not found");
    }

    return data;
  };
}

export const detailInfoService = new DetailInfoService();
