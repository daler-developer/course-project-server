import * as mongoose from 'mongoose';

export interface ICollection {
  _id: mongoose.Types.ObjectId;
  name: string;
  desc: string;
  topic: string;
  imageUrl?: string;
  creatorId: mongoose.Types.ObjectId;
  fields: {
    boolean: string[];
    integer: string[];
    text: string[];
    multitext: string[];
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
    imageUrl: {
      type: String,
      required: false,
    },
    fields: {
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
        multitext: {
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
  { versionKey: false },
);
