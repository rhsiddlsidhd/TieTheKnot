import mongoose, { Schema, Types } from "mongoose";

interface DetailInfoInfo {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  weddingAddress: string;
  weddingDate: string;
  isAccount: Types.ObjectId | null;
  parents: boolean;
}

const detailInfoSchema = new Schema<DetailInfoInfo>({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  weddingAddress: {
    type: String,
    require: true,
  },
  weddingDate: {
    type: String,
    require: true,
  },
  isAccount: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
    default: null,
  },
  parents: {
    type: Boolean,
    require: true,
  },
});

const DetailInfo = mongoose.model<DetailInfoInfo>(
  "user-detail-information",
  detailInfoSchema
);

export default DetailInfo;
