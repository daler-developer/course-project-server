import * as mongoose from 'mongoose';

export interface IItem {
  _id: mongoose.Types.ObjectId;
  collectionId: mongoose.Types.ObjectId;
  name: string;
  fields: object;
  tags: string[];
  likes_ids: mongoose.Types.ObjectId[];
  comments_ids: mongoose.Types.ObjectId[];
  creatorId: mongoose.Types.ObjectId;
  createdAt: Date;
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
      type: {
        text: {
          type: Object,
          required: true,
          default: () => ({}),
        },
        multiLineText: {
          type: Object,
          required: true,
          default: () => ({}),
        },
        integer: {
          type: Object,
          required: true,
          default: () => ({}),
        },
        boolean: {
          type: Object,
          required: true,
          default: () => ({}),
        },
        date: {
          type: Object,
          required: true,
          default: () => ({}),
        },
      },
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    likes_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      default: () => [],
    },
    tags: {
      type: [String],
      required: true,
      default: () => [],
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

ItemSchema.index({ name: 'text', 'comments.text': 'text' });

ItemSchema.virtual('creator', {
  ref: 'user',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true,
});
ItemSchema.virtual('_collection', {
  ref: 'collection',
  localField: 'collectionId',
  foreignField: '_id',
  justOne: true,
});
ItemSchema.virtual('comments', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'itemId',
});
