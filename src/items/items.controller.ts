import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CollectionsService } from 'src/collections/collections.service';
import { User } from 'src/core/decorators/user.decorator';
import {
  ForbiddenToCreateItemError,
  ForbiddenToDeleteItemError,
  ForbiddenToEditItemError,
} from 'src/core/errors/items';
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard';
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe';
import { ParseOffsetPipe } from 'src/core/pipes/parse-offet.pipe';
import { ValidationPipe } from 'src/core/pipes/validation.pipe';
import { IUser } from 'src/users/user.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { ItemsService } from './items.service';

@Controller('/api')
export class ItemsController {
  constructor(
    private itemsService: ItemsService,
    private collectionsService: CollectionsService,
  ) {}

  @Post('/collections/:collectionId/items')
  async createItem(
    @Body() body: CreateItemDto,
    @Param('collectionId', ParseObjectIdPipe) collectionId: Types.ObjectId,
    @User() user: IUser,
  ) {
    const isForbiddenToCreateItem =
      !user.isAdmin &&
      !(await this.collectionsService.checkIfUserIsCreatorOfCollection({
        collectionId,
        userId: user._id,
      }));

    if (isForbiddenToCreateItem) {
      throw new ForbiddenToCreateItemError();
    }

    const item = await this.itemsService.createItemAndReturn({
      ...body,
      collectionId,
      creatorId: user._id,
    });

    return { item };
  }

  @Get('/items/search')
  async searchItems(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    const items = await this.itemsService.searchItems({ offset, tag, search });

    return { items };
  }

  @Get('/collections/:collectionId/items')
  async getItems(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Param('collectionId', ParseObjectIdPipe) collectionId: Types.ObjectId,
  ) {
    const items = await this.itemsService.getCollectionItems({
      offset,
      collectionId,
    });

    return { items };
  }

  @Get('/items/latest')
  async getLatestItems() {
    const items = await this.itemsService.getLatestItems();

    return { items };
  }

  @Get('/items/:_id')
  async getItem(@Param('_id', ParseObjectIdPipe) itemId: Types.ObjectId) {
    const item = await this.itemsService.getItemByIdOrFailIfNotFound(itemId);

    return { item };
  }

  @Patch('/items/:_id')
  @UseGuards(AuthRequiredGuard)
  async editItem(
    @Body(ValidationPipe) body: EditItemDto,
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
    @User() user: IUser,
  ) {
    const isForbiddenToEdit =
      !user.isAdmin &&
      !(await this.itemsService.checkIfItemIsCreatedByUser({
        creatorId: user._id,
        itemId: _id,
      }));

    if (isForbiddenToEdit) {
      throw new ForbiddenToEditItemError();
    }

    const updatedItem = await this.itemsService.editItem({ ...body, _id });

    return { item: updatedItem };
  }

  @Patch('/items/:itemId/like')
  @UseGuards(AuthRequiredGuard)
  async likeItem(@Param('itemId', ParseObjectIdPipe) itemId: Types.ObjectId) {
    await this.itemsService.likeItemOrFailIfAlreadyLiked(itemId);

    return { liked: true };
  }

  @Patch('/items/:itemId/unlike')
  @UseGuards(AuthRequiredGuard)
  async unlikeItem(@Param('itemId', ParseObjectIdPipe) itemId: Types.ObjectId) {
    await this.itemsService.unlikeItemOrFailIfNotLikedYet(itemId);

    return { unliked: true };
  }

  @Delete('/items/:itemId')
  @UseGuards(AuthRequiredGuard)
  async deleteItem(
    @Param('itemId', ParseObjectIdPipe) itemId: Types.ObjectId,
    @User() user: IUser,
  ) {
    const forbiddenToDelete =
      !user.isAdmin &&
      !(await this.itemsService.checkIfItemIsCreatedByUser({
        itemId,
        creatorId: user._id,
      }));

    if (forbiddenToDelete) {
      throw new ForbiddenToDeleteItemError();
    }

    await this.itemsService.deleteItem({ itemId });

    return { unliked: true };
  }
}
