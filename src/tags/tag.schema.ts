import * as mongoose from 'mongoose';

export interface ITag {
  _id: mongoose.Types.ObjectId;
  label: string;
}

export const TagSchema = new mongoose.Schema<ITag>(
  {
    label: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
