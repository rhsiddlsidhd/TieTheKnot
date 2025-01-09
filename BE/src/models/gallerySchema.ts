import mongoose, { Schema, Types } from "mongoose";

interface GalleryItem {
  type: string;
  urls: string[];
}

interface GallerySchema {
  user: Types.ObjectId;
  gallery: {
    [key: string]: GalleryItem;
  };
}

const gallerySchema = new Schema<GallerySchema>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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

const Gallery = mongoose.model<GallerySchema>("Gallery", gallerySchema);
export default Gallery;
