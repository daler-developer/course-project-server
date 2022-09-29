import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './tag.schema';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'tag', schema: TagSchema }])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService, MongooseModule],
})
export class TagsModule {}
