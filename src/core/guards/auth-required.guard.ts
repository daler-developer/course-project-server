import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { NotAuthenticatedError } from 'src/core/errors/auth';
import { RequestService } from 'src/core/request.service';

@Injectable()
export class AuthRequiredGuard implements CanActivate {
  constructor(private requestService: RequestService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.requestService.isAuthenticated &&
      !this.requestService.currentUser.isBlocked
    ) {
      return true;
    }

    throw new NotAuthenticatedError();
  }
}
