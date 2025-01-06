import { Types } from "mongoose";
import { CustomError } from "../controller/oauthController";
import UserModel from "../models/userSchema";
import DetailInfoModel from "../models/detailInfoSchema";
import User from "../models/userSchema";

interface UserPayload {
  _id: Types.ObjectId;
  email: string;
  googleId: string;
  isCompleted: boolean;
  __v: number;
}

class UserService {
  isGoogleId = async (googleId: string): Promise<boolean> => {
    try {
      if (!googleId) {
        throw new Error(`googleId is typeof ${typeof googleId}`);
      }
      const user = await UserModel.findOne({ googleId });
      return user !== null;
    } catch (error) {
      throw error;
    }
  };

  findUserByGoogleId = async (googleId: string) => {
    try {
      //sub = googleId
      if (!googleId) {
        throw new CustomError(400, `GoogleId(sub) is ${typeof googleId}`);
      }
      const user = await User.findOne({ googleId });
      if (!user) {
        throw new CustomError(404, "User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  saveUser = async (email: string, googleId: string): Promise<null> => {
    try {
      const isGoogleId = await this.isGoogleId(googleId);
      if (!isGoogleId) {
        const newUser = new UserModel({
          email,
          googleId,
          isCompleted: false,
        });
        await newUser.save();
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  isDetailInfo = async (_id: Types.ObjectId): Promise<boolean> => {
    try {
      if (!Types.ObjectId.isValid(_id)) {
        throw new Error(`Invalid ${_id} `);
      }

      const isDetailInfo = await DetailInfoModel.findOne({ user: _id });
      return isDetailInfo !== null;
    } catch (error) {
      throw error;
    }
  };

  saveDetailInfo = async (user: UserPayload): Promise<null> => {
    try {
      const isDetailInfo = await this.isDetailInfo(user._id);
      if (!isDetailInfo) {
        const detailInfo = new DetailInfoModel({
          user: user._id,
          weddingAddress: null,
          weddingDate: null,
          isAccount: false,
          parents: false,
        });
        await detailInfo.save();
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
}

export const userService = new UserService();
