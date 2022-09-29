import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IComment } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel('comment') private CommentModel: Model<IComment>) {}

  async createCommentAndReturn({
    creatorId,
    text,
    itemId,
  }: CreateCommentDto & { creatorId: Types.ObjectId; itemId: Types.ObjectId }) {
    const comment = await this.CommentModel.create({ creatorId, text, itemId });

    await comment.populate('creator');

    return comment;
  }

  async getComments({
    offset,
    itemId,
  }: {
    offset: number;
    itemId: Types.ObjectId;
  }) {
    const comments = await this.CommentModel.find({ itemId })
      .populate('creator')
      .sort('-createdAt')
      .skip(offset)
      .limit(10);

    return comments;
  }
}
