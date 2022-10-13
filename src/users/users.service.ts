import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from 'src/users/user.schema';
import {
  IncorrectPasswordError,
  UserNotFoundError,
} from 'src/core/errors/auth';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private UserModel: Model<IUser>) {}

  async changeThemeOfUser({
    userId,
    to,
  }: {
    userId: Types.ObjectId;
    to: 'light' | 'dark';
  }) {
    await this.UserModel.updateOne({ _id: userId }, { $set: { theme: to } });
  }

  async changeLangOfUser({
    userId,
    to,
  }: {
    userId: Types.ObjectId;
    to: 'ru' | 'en';
  }) {
    await this.UserModel.updateOne({ _id: userId }, { $set: { lang: to } });
  }

  async userWithUsernameExists(username: string) {
    return await this.UserModel.exists({ username });
  }

  async createUserAndReturn(dto: CreateUserDto) {
    const user = await this.UserModel.create(dto);

    return user;
  }

  async getUserByUsernameOrFailIfNotFound(username: string) {
    const user = await this.UserModel.findOne({ username });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async getUserById(_id: Types.ObjectId) {
    return await this.UserModel.findById(_id);
  }

  async getUserByIdOrFail(_id: Types.ObjectId) {
    const user = await this.getUserById(_id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async checkIfPasswordMatchesOrFail(userId: Types.ObjectId, password: string) {
    const user = await this.UserModel.findOne({ _id: userId, password });

    if (!user) {
      throw new IncorrectPasswordError();
    }
  }

  async getAdminUsers({ offset }: { offset: number }) {
    const users = await this.UserModel.find().skip(offset).limit(10);

    return users;
  }

  async blockUser(userId: Types.ObjectId) {
    await this.UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: true } },
    );
  }

  async unblockUser(userId: Types.ObjectId) {
    await this.UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: false } },
    );
  }

  async deleteUser(userId: Types.ObjectId) {
    await this.UserModel.deleteOne({ _id: userId });
  }

  async addUserToAdmins(userId: Types.ObjectId) {
    await this.UserModel.updateOne(
      { _id: userId },
      { $set: { isAdmin: true } },
    );
  }

  async removeUserToAdmins(userId: Types.ObjectId) {
    await this.UserModel.updateOne(
      { _id: userId },
      { $set: { isAdmin: false } },
    );
  }
}
