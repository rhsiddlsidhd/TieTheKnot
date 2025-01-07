import mongoose, { Schema, Types } from "mongoose";

interface thumnailSchema {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  url: string[];
}

const thumnailSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: "User",
  },
  url: {
    type: [String],
    require: true,
    validate: {
      validator: (urls: string[]): boolean => {
        return urls.length === 2;
      },
      message: `썸네일은 두개의 이미지를 필요로 합니다.`,
    },
  },
});

const Thumnail = mongoose.model("Thumnail", thumnailSchema);

export default Thumnail;
