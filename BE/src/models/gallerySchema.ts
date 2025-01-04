import mongoose, { Schema, Types } from "mongoose";

interface GallerySchema {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  types: string[];
  urls: string[];
}

const gallerySchema = new Schema<GallerySchema>({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  types: {
    type: [String],
    require: true,
  },
  urls: {
    type: [String],
    require: true,
  },
});

const Gallery = mongoose.model<GallerySchema>("Gallery", gallerySchema);
export default Gallery;
