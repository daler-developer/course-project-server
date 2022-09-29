import { IUser } from 'src/users/user.schema';

declare module 'express' {
  interface Request {
    user: IUser;
  }
}
