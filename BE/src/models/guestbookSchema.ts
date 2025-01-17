import mongoose, { Schema, Types } from "mongoose";

interface GuestBook {
  _id: Types.ObjectId;
  nickname: string;
  password: string;
  content: string;
  orderId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const guestBookSchema = new Schema<GuestBook>(
  {
    nickname: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const GuestBook = mongoose.model<GuestBook>("GuestBook", guestBookSchema);

export default GuestBook;
