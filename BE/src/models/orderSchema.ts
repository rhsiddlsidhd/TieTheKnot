import mongoose, { Schema, Types } from "mongoose";

interface Gallery {
  [key: string]: {
    type: string;
    urls: string[];
  };
}

interface Account {
  name: string;
  bankName: string;
  accountNumber: string;
}

interface parent {
  name: string;
  isAlive: boolean;
}

interface OrderSchema {
  user: Types.ObjectId;
  weddingAddress: string;
  weddingDate: string;
  isAccount: Account[];
  parent: parent[];
  thumnail: string[];
  gallery: Gallery;
}

const orderSchema = new Schema<OrderSchema>({
  //웨딩주소, 웨딩날짜
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  weddingAddress: {
    type: String,
    required: true,
  },
  weddingDate: {
    type: String,
    require: true,
  },
  isAccount: {
    type: [
      {
        name: { type: String, required: true },
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
      },
    ],
    default: null,
  },
  parent: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        isAlive: {
          type: Boolean,
          required: true,
        },
      },
    ],
    default: null,
  },
  thumnail: {
    type: [String],
    required: true,
  },
  gallery: {
    type: Map,
    of: {
      type: {
        type: String,
      },
      urls: {
        type: [String],
      },
    },
    required: true,
  },
});

const Order = mongoose.model<OrderSchema>("Order", orderSchema);

export default Order;
