import { CustomError } from "../controller/oauthController";
import UserModel from "../models/userSchema";

class UserService {
  async isGoogleId(googleId: string) {
    try {
      const user = await UserModel.findOne({ googleId });
      return user !== null;
    } catch (error) {
      throw error;
    }
  }

  async getEmail(email: string) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async createEmail(
    email: string,
    googleId: string,
    refresh: string
  ): Promise<UserModel | null> {
    try {
      const isGoogleId = await this.isGoogleId(googleId);
      if (!isGoogleId) {
        const newUser = new UserModel({
          email,
          googleId,
          refresh,
          isCompleted: false,
        });
        return await newUser.save();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
