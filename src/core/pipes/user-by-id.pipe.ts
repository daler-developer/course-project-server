import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationError } from '../errors/common';
import * as yup from 'yup';
import { isValidObjectId, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private usersService: UsersService) {}

  async transform(value: string) {
    const isValid = isValidObjectId(value);

    if (!isValid) {
      throw new ValidationError();
    }

    const user = await this.usersService.getUserByIdOrFail(
      new Types.ObjectId(value),
    );

    return user;
  }
}
