import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/core/decorators/user.decorator';
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard';
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe';
import { ParseOffsetPipe } from 'src/core/pipes/parse-offet.pipe';
import { ValidationPipe } from 'src/core/pipes/validation.pipe';
import { IUser } from 'src/users/user.schema';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('/api')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('/items/:itemId/comments')
  @UseGuards(AuthRequiredGuard)
  async createComment(
    @Param('itemId', ParseObjectIdPipe) itemId: Types.ObjectId,
    @Body(ValidationPipe) body: CreateCommentDto,
    @User() user: IUser,
  ) {
    const comment = await this.commentsService.createCommentAndReturn({
      ...body,
      creatorId: user._id,
      itemId,
    });

    return { comment };
  }

  @Get('/items/:itemId/comments')
  async getComments(
    @Param('itemId', ParseObjectIdPipe) itemId: Types.ObjectId,
    @Query('offset', ParseOffsetPipe) offset: number,
  ) {
    const comments = await this.commentsService.getComments({ itemId, offset });

    return { comments };
  }
}
