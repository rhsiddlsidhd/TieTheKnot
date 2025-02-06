import mongoose, { Schema, Types } from "mongoose";

interface Gallery {
  [key: string]: {
    type: string;
    urls: string[];
  };
}

interface Name {
  groom: string;
  bride: string;
}

interface Account {
  name: string;
  bankName: string;
  accountNumber: string;
}

interface parent {
  name: string;
  isDeceased: boolean;
}

export interface OrderSchema {
  user: Types.ObjectId;
  name: Name;
  weddingAddress: string;
  weddingAddressDetail: string;
  weddingDate: string;
  account: Account[];
  parent: parent[];
  thumnail: string[];
  gallery: Gallery;
  isCompleted: boolean;
}

const orderSchema = new Schema<OrderSchema>({
  //웨딩주소, 웨딩날짜
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: {
      groom: {
        type: String,
      },
      bride: {
        type: String,
      },
    },
    _id: false,
    required: true,
  },
  weddingAddress: {
    type: String,
    required: true,
  },
  weddingAddressDetail: {
    type: String,
    required: true,
  },
  weddingDate: {
    type: String,
    require: true,
  },
  account: {
    type: [
      {
        name: { type: String, required: true },
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
      },
    ],
    _id: false,
    default: null,
  },
  parent: {
    type: [
      {
        badge: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        isDeceased: {
          type: Boolean,
          required: true,
        },
      },
    ],
    _id: false,
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

  isCompleted: { type: Boolean, default: false },
});

orderSchema.pre("save", function (next) {
  if (this.isCompleted === undefined) {
    this.isCompleted = false;
  }

  next();
});

const Order = mongoose.model<OrderSchema>("Order", orderSchema);

export default Order;
