import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './item.schema';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'item', schema: ItemSchema }])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService, MongooseModule],
})
export class ItemsModule {}
