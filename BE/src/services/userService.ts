import { CustomError } from "../controller/userController";
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
    googleId: string
  ): Promise<UserModel | null> {
    try {
      const isGoogleId = await this.isGoogleId(googleId);
      if (!isGoogleId) {
        const newUser = new UserModel({ email, isCompleted: false, googleId });
        return await newUser.save();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
