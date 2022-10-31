import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard';
import { AdminRequiredGuard } from 'src/core/guards/admin-required.guard';
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe';
import { ParseOffsetPipe } from 'src/core/pipes/parse-offet.pipe';
import { GetUsersDto } from './dto/get-users-query';
import { UsersService } from './users.service';
import { UserByIdPipe } from 'src/core/pipes/user-by-id.pipe';
import { IUser } from './user.schema';
import { User } from 'src/core/decorators/user.decorator';
import { CollectionsService } from 'src/collections/collections.service';
import { ItemsService } from 'src/items/items.service';

@Controller('/api')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private collectionsService: CollectionsService,
    private itemsService: ItemsService,
  ) {}

  @Get('/users/me')
  @UseGuards(AuthRequiredGuard)
  async getMe(@User() user: IUser) {
    return { user };
  }

  @Get('/admin/users')
  @UseGuards(AuthRequiredGuard, AdminRequiredGuard)
  async getAdminUsers(@Query('offset', ParseOffsetPipe) offset: number) {
    const users = await this.usersService.getAdminUsers({ offset });

    return { users };
  }

  @Get('/users/:_id')
  @UseGuards(AuthRequiredGuard, AdminRequiredGuard)
  async getUser(@Param('_id', UserByIdPipe) user: IUser) {
    return { user };
  }

  @Patch('/users/:_id/block')
  @UseGuards(AuthRequiredGuard, AdminRequiredGuard)
  async blockUser(@Param('_id', UserByIdPipe) user: IUser) {
    await this.usersService.blockUser(user._id);

    return { blocked: true };
  }

  @Patch('/users/:_id/unblock')
  @UseGuards(AuthRequiredGuard, AdminRequiredGuard)
  async unblockUser(@Param('_id', UserByIdPipe) user: IUser) {
    await this.usersService.unblockUser(user._id);

    return { unblocked: false };
  }

  @Delete('/users/:_id')
  @UseGuards(AuthRequiredGuard, AdminRequiredGuard)
  async deleteUser(@Param('_id', UserByIdPipe) user: IUser) {
    await this.usersService.deleteUser(user._id);
    await this.collectionsService.deleteCollectionsWithCreatorId(user._id);
    await this.itemsService.deleteItemsWithCreatorId(user._id);

    return { deleted: true };
  }

  @Patch('/users/:_id/add-to-admins')
  @UseGuards(AuthRequiredGuard, AdminRequiredGuard)
  async addToAdmins(@Param('_id', UserByIdPipe) user: IUser) {
    await this.usersService.addUserToAdmins(user._id);

    return { addedToAdmins: true };
  }

  @Patch('/users/:_id/remove-from-admins')
  @UseGuards(AuthRequiredGuard, AdminRequiredGuard)
  async removeFromAdmins(@Param('_id', UserByIdPipe) user: IUser) {
    await this.usersService.removeUserToAdmins(user._id);

    return { addedToAdmins: true };
  }
}
