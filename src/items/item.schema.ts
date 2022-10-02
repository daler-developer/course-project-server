import * as mongoose from 'mongoose';

export interface IItem {
  _id: mongoose.Types.ObjectId;
  collectionId: mongoose.Types.ObjectId;
  name: string;
  tags: string[];
  fields: object;
  likes_ids: mongoose.Types.ObjectId[];
  comments_ids: mongoose.Types.ObjectId[];
}

export const ItemSchema = new mongoose.Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      default: () => [],
    },
    fields: {
      type: Object,
      required: true,
    },
    likes_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      default: () => [],
    },
    comments_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      default: () => [],
    },
  },
  { versionKey: false },
);
