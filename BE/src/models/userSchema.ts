import mongoose, { Schema, Types } from "mongoose";

interface User {
  _id: Types.ObjectId;
  email: string;
  googleId: string;
  isCompleted: boolean;
  refresh: string | null;
}

const userSehema = new Schema<User>({
  email: { type: String, required: true },
  googleId: { type: String, require: true },
  refresh: {
    type: String,
    required: false,
    default: null,
  },
  isCompleted: { type: Boolean, required: true },
});

const User = mongoose.model<User>("User", userSehema);

export default User;
