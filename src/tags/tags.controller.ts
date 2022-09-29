import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('/api')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get('/common/tags')
  async getTags() {
    console.log('TAGS');
    const tags = await this.tagsService.getAllTags();

    return { tags };
  }

  @Get('/tags/search')
  async searchTags(@Query('search') search: string) {
    const tags = await this.tagsService.searchTags({ search });

    return { tags };
  }
}
