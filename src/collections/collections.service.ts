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

  async getUserCollections({
    userId,
    offset,
  }: {
    userId: Types.ObjectId;
    offset: number;
  }) {
    const collections = await this.CollectionModel.find({
      creatorId: userId,
    })
      .populate('creator')
      .skip(offset)
      .limit(10);

    return collections;
  }

  async createCollectionAndReturn({
    desc,
    fields,
    imageUrl,
    name,
    creatorId,
    topic,
  }: CreateCollectionDto & { imageUrl: string; creatorId: Types.ObjectId }) {
    const collection = await this.CollectionModel.create({
      desc,
      fields,
      imageUrl,
      name,
      topic,
      creatorId,
    });

    collection.populate({
      path: 'creatorId',
    });

    return collection;
  }

  async getCollectionByIdOrFailIfNotFound(_id: Types.ObjectId) {
    const collection = await this.CollectionModel.findById(_id);

    console.log(collection as any);

    if (!collection) {
      throw new CollectionNotFoundError();
    }

    return collection;
  }

  async checkIfUserIsCreatorOfCollection({
    collectionId,
    userId,
  }: {
    collectionId: Types.ObjectId;
    userId: Types.ObjectId;
  }) {
    return !!(await this.CollectionModel.findOne({
      creatorId: userId,
      _id: collectionId,
    }));
  }

  async deleteCollection(collectionId: Types.ObjectId) {
    await this.CollectionModel.deleteOne({ _id: collectionId });
  }
}
