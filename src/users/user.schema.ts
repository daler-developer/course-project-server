import * as mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  isAdmin: boolean;
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
  { versionKey: false },
);
