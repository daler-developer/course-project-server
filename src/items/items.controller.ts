import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CollectionsService } from 'src/collections/collections.service';
import { User } from 'src/core/decorators/user.decorator';
import { ForbiddenToCreateItemError } from 'src/core/errors/items';
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard';
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe';
import { IUser } from 'src/users/user.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';

@Controller('/api')
export class ItemsController {
  constructor(
    private itemsService: ItemsService,
    private collectionsService: CollectionsService,
  ) {}

  @Post('/collections/:collectionId/items')
  @UseGuards(AuthRequiredGuard)
  async createItem(
    @Body() body: CreateItemDto,
    @Param('collectionId', ParseObjectIdPipe) collectionId: Types.ObjectId,
    @User() user: IUser,
  ) {
    const isForbiddenToCreateItem =
      !user.isAdmin &&
      (await this.collectionsService.checkIfUserIsCreatorOfCollection({
        collectionId,
        userId: user._id,
      }));

    if (isForbiddenToCreateItem) {
      throw new ForbiddenToCreateItemError();
    }

    const item = await this.itemsService.createItemAndReturn({
      ...body,
      collectionId,
    });

    return { item };
  }

  @Patch('/items/:itemId/like')
  @UseGuards(AuthRequiredGuard)
  async likeItem(@Param('itemId', ParseObjectIdPipe) itemId: Types.ObjectId) {
    await this.itemsService.likeItemOrFailIfAlreadyLiked(itemId);

    return { liked: true };
  }
}
