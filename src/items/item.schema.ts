import * as mongoose from 'mongoose';

export interface IItem {
  _id: mongoose.Types.ObjectId;
  collectionId: mongoose.Types.ObjectId;
  name: string;
  tags: string[];
  fields: object;
  likes_ids: mongoose.Types.ObjectId[];
  comments_ids: mongoose.Types.ObjectId[];
  creatorId: mongoose.Types.ObjectId;
}

export const ItemSchema = new mongoose.Schema<IItem>(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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

ItemSchema.virtual('creator', {
  ref: 'user',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true,
});
