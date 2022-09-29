import { forwardRef, Inject, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CollectionsService } from 'src/collections/collections.service';
import {
  AlreadyLikedItemError,
  DidNotLikedItemError,
  ItemNotFoundError,
} from 'src/core/errors/items';
import { RequestService } from 'src/core/request.service';
import { TagsService } from 'src/tags/tags.service';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { IItem } from './item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel('item') private ItemModel: Model<IItem>,
    @Inject(forwardRef(() => CollectionsService))
    private collectionsService: CollectionsService,
    private requestService: RequestService,
    private tagsService: TagsService,
  ) {}

  async getLatestItems() {
    const items = await this.ItemModel.find()
      .sort('-createdAt')
      .populate('creator')
      .populate('_collection')
      .limit(5);

    return items;
  }

  async editItem({
    fields,
    name,
    tags,
    _id,
  }: EditItemDto & { _id: Types.ObjectId }) {
    await this.ItemModel.updateOne({ _id }, { $set: { fields, name, tags } });

    const updatedItem = await this.getItemByIdOrFailIfNotFound(_id);

    return updatedItem;
  }

  async searchItems({
    offset,
    search,
    tag,
  }: {
    offset: number;
    tag?: string;
    search?: string;
  }) {
    if (search) {
      const items = await this.ItemModel.find({
        $text: {
          $search: search,
        },
      })
        .skip(offset)
        .limit(10);

      return items;
    }

    if (tag) {
      const items = await this.ItemModel.find({
        tags: {
          $all: [tag],
        },
      })
        .skip(offset)
        .limit(10);

      return items;
    }

    return [] as IItem[];
  }

  async deleteItemsWithCollectionId(collectionId: Types.ObjectId) {
    await this.ItemModel.deleteMany({ collectionId });
  }

  async createItemAndReturn({
    fields,
    tags,
    collectionId,
    creatorId,
    name,
  }: CreateItemDto & {
    collectionId: Types.ObjectId;
    creatorId: Types.ObjectId;
  }) {
    const collection =
      await this.collectionsService.getCollectionByIdOrFailIfNotFound(
        collectionId,
      );

    const item = await this.ItemModel.create({
      fields,
      collectionId,
      creatorId: collection.creatorId,
      name,
      tags,
    });

    await this.tagsService.createTags(tags);

    await this.collectionsService.incrementNumItemsInCollection({
      collectionId,
    });

    return item;
  }

  async deleteItem({ itemId }: { itemId: Types.ObjectId }) {
    const itemToBeDeleted = await this.ItemModel.findById(itemId);

    await this.ItemModel.deleteOne({ _id: itemId });
    await this.collectionsService.decrementNumItemsInCollection({
      collectionId: itemToBeDeleted.collectionId,
    });
  }

  async deleteItemsWithCreatorId(creatorId: Types.ObjectId) {
    await this.ItemModel.deleteMany({ creatorId });
  }

  async getItemByIdOrFailIfNotFound(_id: Types.ObjectId) {
    const item = await this.ItemModel.findById(_id)
      .populate('creator')
      .populate('_collection');

    if (!item) {
      throw new ItemNotFoundError();
    }

    return item;
  }

  async checkIfItemIsCreatedByUser({
    itemId,
    creatorId,
  }: {
    itemId: Types.ObjectId;
    creatorId: Types.ObjectId;
  }) {
    return await this.ItemModel.exists({ _id: itemId, creatorId });
  }

  async getCollectionItems({
    collectionId,
    offset,
  }: {
    collectionId: Types.ObjectId;
    offset: number;
  }) {
    const items = await this.ItemModel.find({ collectionId })
      .populate('creator')
      .populate('_collection')
      .skip(offset)
      .limit(10);

    return items;
  }

  async likeItemOrFailIfAlreadyLiked(itemId: Types.ObjectId) {
    if (
      await this.ItemModel.findOne({
        _id: itemId,
        likes_ids: { $all: [this.requestService.currentUser._id] },
      })
    ) {
      throw new AlreadyLikedItemError();
    } else {
      await this.ItemModel.updateOne(
        {
          _id: itemId,
        },
        {
          $push: {
            likes_ids: [this.requestService.currentUser._id],
          },
        },
      );
    }
  }

  async unlikeItemOrFailIfNotLikedYet(itemId: Types.ObjectId) {
    if (
      !(await this.ItemModel.findOne({
        _id: itemId,
        likes_ids: { $all: [this.requestService.currentUser._id] },
      }))
    ) {
      throw new DidNotLikedItemError();
    } else {
      await this.ItemModel.updateOne(
        {
          _id: itemId,
        },
        {
          $pull: {
            likes_ids: this.requestService.currentUser._id,
          },
        },
      );
    }
  }
}
