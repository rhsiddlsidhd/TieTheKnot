import mongoose, { Schema, Types } from "mongoose";

interface GuestBook {
  _id: Types.ObjectId;
  nickname: string;
  password: string;
  content: string;
  orderId: string;
}

const guestBookSchema = new Schema<GuestBook>({
  nickname: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const GuestBook = mongoose.model<GuestBook>("GuestBook", guestBookSchema);

export default GuestBook;
