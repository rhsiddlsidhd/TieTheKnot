import mongoose, { Schema, Types } from "mongoose";

interface ParentsSchema {
  _id: Types.ObjectId;
  names: {
    father: {
      type: string;
    };
    mother: {
      type: string;
    };
  };
  isAlive: {
    father: {
      type: boolean;
    };
    mother: {
      type: boolean;
    };
  };
}

const parentsSchema = new Schema<ParentsSchema>({
  names: {
    father: {
      type: String,
    },
    mother: {
      type: String,
    },
  },
  isAlive: {
    father: {
      type: Boolean,
    },
    mother: {
      type: Boolean,
    },
  },
});

const Parents = mongoose.model("Parents", parentsSchema);

export default Parents;
