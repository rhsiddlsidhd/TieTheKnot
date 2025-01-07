import mongoose, { Schema, Types } from "mongoose";

interface Gallery {
  [key: string]: string[];
}

interface OrderSchema {
  user: Types.ObjectId;
  weddingAddress: string;
  weddingDate: string;
  isAccount: Types.ObjectId | null;
  parents: Types.ObjectId | null;
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    default: null,
  },
  parents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parents",
    default: null,
  },
  thumnail: {
    type: [String],
    required: true,
    validate: {
      validator: (urls) => {
        console.log(urls);
        return urls.length === 2;
      },
      message: `썸네일 이미지는 총 두장을 필요로 합니다.`,
    },
  },
  gallery: {
    type: [Schema.Types.Mixed],
    required: true,
    min: [1, `최소 1가지 이상의 타입 갤러리를 선택하셔야 합니다.`],
  },
});

const Order = mongoose.model<OrderSchema>("Order", orderSchema);

export default Order;
