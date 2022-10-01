import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CollectionNotFoundError } from 'src/core/errors/collections';
import { IUser } from 'src/users/user.schema';
import { ICollection } from './collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel('collection') private CollectionModel: Model<ICollection>,
  ) {}

  async createCollectionAndReturn({
    desc,
    fields,
    imageUrl,
    name,
    topic,
  }: CreateCollectionDto & { imageUrl: string }) {
    const collection = await this.CollectionModel.create({
      desc,
      fields,
      imageUrl,
      name,
      topic,
    });

    return collection;
  }

  async getCollectionByIdOrFailIfNotFound(_id: Types.ObjectId) {
    const collection = await this.CollectionModel.findById(_id);

    if (!collection) {
      throw new CollectionNotFoundError();
    }

    return collection;
  }
}
