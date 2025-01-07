import mongoose, { Schema, Types } from "mongoose";

interface User {
  _id: Types.ObjectId;
  email: string;
  googleId: string;
  isCompleted: boolean;
}

const userSehema = new Schema<User>({
  email: { type: String, required: true },
  googleId: { type: String, require: true },
  isCompleted: { type: Boolean, required: true },
});

const User = mongoose.model<User>("User", userSehema);

export default User;
