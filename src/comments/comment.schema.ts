import * as mongoose from 'mongoose';

export interface IComment {
  _id: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export const CommentSchema = new mongoose.Schema<IComment>(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CommentSchema.index({ name: 'text' });

CommentSchema.virtual('creator', {
  ref: 'user',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true,
});
