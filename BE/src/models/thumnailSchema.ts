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
  },
});

const Thumnail = mongoose.model("Thumnail", thumnailSchema);

export default Thumnail;
