import mongoose, { Schema, Types } from "mongoose";

interface GalleryItems {
  [key: string]: {
    type: string;
    urls: string[];
  };
}

type Gallery = GalleryItems;

interface OrderSchema {
  user: Types.ObjectId;
  weddingAddress: string;
  weddingDate: string;
  isAccount: any;
  parents: any;
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
    type: Schema.Types.Mixed,

    default: null,
  },
  parents: {
    type: Schema.Types.Mixed,

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
    type: Map,
    of: new Schema({
      type: {
        type: String,
      },
      urls: {
        type: [String],
      },
    }),
    required: true,
  },
});

const Order = mongoose.model<OrderSchema>("Order", orderSchema);

export default Order;
