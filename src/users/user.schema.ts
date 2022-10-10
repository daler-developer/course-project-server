import * as mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  isAdmin: boolean;
  theme: 'light' | 'dark';
  lang: 'ru' | 'en';
  isBlocked: boolean;
}

export const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
      default: () => 'light',
    },
    lang: {
      type: String,
      required: true,
      default: () => 'ru',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: () => false,
    },
    isBlocked: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
