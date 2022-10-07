import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './comment.schema';
import { CommentsService } from './comment.service';
import { CommentsController } from './comments.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'comment', schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService, MongooseModule],
})
export class CommentsModule {}
