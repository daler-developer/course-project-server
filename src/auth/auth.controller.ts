import { Controller, Get } from '@nestjs/common';

@Controller('/api')
export class AuthController {
  @Get('/auth/me')
  async getMe() {
    return {
      id: 'id111',
      name: 'daler',
    };
  }
}
