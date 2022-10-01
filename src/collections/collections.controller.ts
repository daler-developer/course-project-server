import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
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

@Controller('/api')
export class CollectionsController {
  constructor(private collectionsService: CollectionsService) {}

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
}
