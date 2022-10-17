import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from './collection.schema';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'collection', schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService, MongooseModule],
})
export class CollectionsModule {}
