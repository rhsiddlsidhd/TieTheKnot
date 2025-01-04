import mongoose, { Schema, Types } from "mongoose";
interface ParentsSchema {
  _id: Types.ObjectId;
  detailInfo: Types.ObjectId;
  parentType: string;
  name: string;
  isAlive: boolean;
}

const parentsSchema = new Schema<ParentsSchema>({
  detailInfo: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "DetailInfo",
  },
  parentType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isAlive: {
    type: Boolean,
    required: true,
  },
});

const Parents = mongoose.model("Parents", parentsSchema);

export default Parents;
