import mongoose, { Schema, Types } from "mongoose";

interface AccountSchema {
  _id: Types.ObjectId;
  detailInfo: Types.ObjectId;
  name: string;
  spouseType: String;
  accountNumber: String;
}

const accountSchema = new Schema<AccountSchema>({
  detailInfo: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: "DetailInfo",
  },
  name: {
    type: String,
    require: true,
  },
  spouseType: {
    type: String,
    require: true,
  },
  accountNumber: {
    type: String,
    require: true,
  },
});

const Account = mongoose.model<AccountSchema>("Account", accountSchema);

export default Account;
