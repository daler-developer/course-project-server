import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard';
import { ValidationPipe } from 'src/core/pipes/validation.pipe';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import * as cloundinary from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { CollectionByIdPipe } from 'src/core/pipes/collection-by-id.pipe';
import { ICollection } from './collection.schema';
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { RequestService } from 'src/core/request.service';
import { ParseOffsetPipe } from 'src/core/pipes/parse-offet.pipe';
import { User } from 'src/core/decorators/user.decorator';
import { IUser } from 'src/users/user.schema';
import { ForbiddenToDeleteCollectionError } from 'src/core/errors/collections';

@Controller('/api')
export class CollectionsController {
  constructor(
    private collectionsService: CollectionsService,
    private requestService: RequestService,
  ) {}

  @Post('/collections')
  @UseGuards(AuthRequiredGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createCollection(
    @UploadedFile() file: any,
    @Body(ValidationPipe) body: CreateCollectionDto,
  ) {
    const { url: imageUrl }: { url: string } = await new Promise(
      (resolve, reject) => {
        const upload = cloundinary.v2.uploader.upload_stream(
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(upload);
      },
    );

    const collection = await this.collectionsService.createCollectionAndReturn({
      ...body,
      imageUrl,
      creatorId: this.requestService.currentUser._id,
    });

    return { collection };
  }

  @Get('/collections/:_id')
  @UseGuards(AuthRequiredGuard)
  async getCollection(@Param('_id', ParseObjectIdPipe) _id: Types.ObjectId) {
    const collection =
      await this.collectionsService.getCollectionByIdOrFailIfNotFound(_id);

    return { collection };
  }

  @Get('/profile/collections')
  @UseGuards(AuthRequiredGuard)
  async getProfileCollections(
    @Query('offset', ParseOffsetPipe) offset: number,
    @User() currentUser: IUser,
  ) {
    const collections = await this.collectionsService.getUserCollections({
      userId: currentUser._id,
      offset,
    });

    return { collections };
  }

  @Delete('/collections/:_id')
  @UseGuards(AuthRequiredGuard)
  async deleteCollection(
    @User() user: IUser,
    @Param('_id', ParseObjectIdPipe) collectionId: Types.ObjectId,
  ) {
    const forbiddenToDelete =
      !user.isAdmin &&
      (await this.collectionsService.checkIfUserIsCreatorOfCollection({
        userId: user._id,
        collectionId,
      }));

    if (forbiddenToDelete) {
      throw new ForbiddenToDeleteCollectionError();
    }

    await this.collectionsService.deleteCollection(collectionId);

    return { deleted: true };
  }
}
