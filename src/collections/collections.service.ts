import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CollectionNotFoundError } from 'src/core/errors/collections';
import { IItem } from 'src/items/item.schema';
import { ItemsService } from 'src/items/items.service';
import { IUser } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { ICollection } from './collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { EditCollectionDto } from './dto/edit-collection.dto';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel('collection') private CollectionModel: Model<ICollection>,
    @Inject(forwardRef(() => ItemsService))
    private itemsService: ItemsService, // @InjectModel('item') private ItemModel: Model<IItem>,
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

  async getLargestCollections() {
    const collections = await this.CollectionModel.find()
      .sort('-numItems')
      .populate('creator')
      .limit(5);

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

  async getCollectionCsv({ collectionId }: { collectionId: Types.ObjectId }) {
    const collection = await this.CollectionModel.findOne({
      _id: collectionId,
    }).populate<{ items: IItem }>('items');

    return stringify(collection.items as any, { delimiter: ';' });
  }

  async editCollection({
    collectionId,
    desc,
    fields,
    imageUrl,
    name,
    topic,
  }: EditCollectionDto & {
    imageUrl: string;
    collectionId: Types.ObjectId;
  }) {
    await this.CollectionModel.updateOne(
      { _id: collectionId },
      {
        $set: {
          desc,
          fields,
          name,
          topic,
          ...(imageUrl && { imageUrl }),
        },
        $unset: {
          ...(!imageUrl && { imageUrl: 1 }),
        },
      },
    );

    const updatedCollection = await this.getCollectionByIdOrFailIfNotFound(
      collectionId,
    );

    await this.itemsService.deleteItemsWithCollectionId(collectionId);

    return updatedCollection;
  }

  async incrementNumItemsInCollection({
    collectionId,
  }: {
    collectionId: Types.ObjectId;
  }) {
    await this.CollectionModel.updateOne(
      { _id: collectionId },
      {
        $inc: {
          numItems: 1,
        },
      },
    );
  }

  async decrementNumItemsInCollection({
    collectionId,
  }: {
    collectionId: Types.ObjectId;
  }) {
    await this.CollectionModel.updateOne(
      { _id: collectionId },
      {
        $inc: {
          numItems: -1,
        },
      },
    );
  }

  async getCollectionByIdOrFailIfNotFound(_id: Types.ObjectId) {
    const collection = await this.CollectionModel.findById(_id).populate(
      'creator',
    );

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
    await this.itemsService.deleteItemsWithCollectionId(collectionId);
  }

  async deleteCollectionsWithCreatorId(creatorId: Types.ObjectId) {
    await this.CollectionModel.deleteMany({ creatorId });
  }
}
