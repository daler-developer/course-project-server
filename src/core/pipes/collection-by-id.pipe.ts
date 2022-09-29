import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationError } from '../errors/common';
import * as yup from 'yup';
import { isValidObjectId, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CollectionsService } from 'src/collections/collections.service';

@Injectable()
export class CollectionByIdPipe implements PipeTransform {
  constructor(private collectionsService: CollectionsService) {}

  async transform(value: string) {
    const isValid = isValidObjectId(value);

    if (!isValid) {
      throw new ValidationError();
    }

    const collection =
      await this.collectionsService.getCollectionByIdOrFailIfNotFound(
        new Types.ObjectId(value),
      );

    return collection;
  }
}
