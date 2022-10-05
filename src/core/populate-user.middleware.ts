import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { NotAuthenticatedError } from './errors/auth';

@Injectable()
export class PopulateUserMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;

      if (authorization) {
        const token = authorization.split(' ')[1];

        if (token) {
          const decoded = this.authService.verifyToken(token) as JwtPayload;

          const currentUser = await this.usersService.getUserById(
            new Types.ObjectId(decoded.userId),
          );

          if (currentUser) {
            req.user = currentUser;
          }
        }
      }

      return next();
    } catch (e) {
      return next();
    }
  }
}
