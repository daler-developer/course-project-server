import * as mongoose from 'mongoose';

export interface ICollection {
  _id: mongoose.Types.ObjectId;
  name: string;
  desc: string;
  topic: string;
  imageUrl?: string;
  creatorId: mongoose.Types.ObjectId;
  numItems: number;
  fields: {
    boolean: string[];
    integer: string[];
    text: string[];
    multiLineText: string[];
    date: string[];
  };
}

export const CollectionSchema = new mongoose.Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    numItems: {
      type: Number,
      required: true,
      default: () => 0,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    topic: {
      type: String,
      required: false,
    },
    fields: {
      _id: false,
      type: {
        boolean: {
          type: [String],
          required: true,
          default: () => [],
        },
        integer: {
          type: [String],
          required: true,
          default: () => [],
        },
        text: {
          type: [String],
          required: true,
          default: () => [],
        },
        multiLineText: {
          type: [String],
          required: true,
          default: () => [],
        },
        date: {
          type: [String],
          required: true,
          default: () => [],
        },
      },
      required: true,
      default: () => ({}),
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CollectionSchema.virtual('creator', {
  ref: 'user',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true,
});
CollectionSchema.virtual('items', {
  ref: 'item',
  localField: '_id',
  foreignField: 'collectionId',
});
