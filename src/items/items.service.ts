import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AlreadyLikedItemError } from 'src/core/errors/items';
import { RequestService } from 'src/core/request.service';
import { CreateItemDto } from './dto/create-item.dto';
import { IItem } from './item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel('item') private ItemModel: Model<IItem>,
    private requestService: RequestService,
  ) {}

  async createItemAndReturn({
    fields,
    collectionId,
  }: CreateItemDto & { collectionId: Types.ObjectId }) {
    const item = await this.ItemModel.create({
      fields,
      collectionId,
    });

    return item;
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
}
