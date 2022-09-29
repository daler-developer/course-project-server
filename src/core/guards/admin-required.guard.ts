import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminRequiredError } from 'src/core/errors/auth';
import { RequestService } from 'src/core/request.service';

@Injectable()
export class AdminRequiredGuard implements CanActivate {
  constructor(private requestService: RequestService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.requestService.currentUser.isAdmin) {
      return true;
    }

    throw new AdminRequiredError();
  }
}
