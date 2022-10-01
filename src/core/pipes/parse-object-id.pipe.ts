import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationError } from '../errors/common';
import * as yup from 'yup';
import { isValidObjectId, Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  async transform(value: string) {
    const isValid = isValidObjectId(value);

    if (!isValid) {
      throw new ValidationError();
    }

    return new Types.ObjectId(value);
  }
}
