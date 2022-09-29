import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemsService } from 'src/items/items.service';
import { ITag } from './tag.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel('tag') private TagModel: Model<ITag>) {}

  async getAllTags() {
    const tags = await this.TagModel.find();

    return tags;
  }

  async createTags(tags: string[]) {
    for (let tag of tags) {
      if (!(await this.TagModel.exists({ label: tag }))) {
        await this.createTagAndReturn(tag);
      }
    }
  }

  async searchTags({ search }: { search: string }) {
    const tags = await this.TagModel.find({
      label: { $regex: new RegExp(search, 'i') },
    });

    return tags;
  }

  async createTagIfNotExistsAndReturn(label: string) {
    const tag = await this.TagModel.findOne({ label });

    if (tag) {
      return tag;
    }

    const newTag = await this.createTagAndReturn(label);

    return newTag;
  }

  private async createTagAndReturn(label: string) {
    const tag = await this.TagModel.create({ label });

    return tag;
  }
}
