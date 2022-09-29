import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../users/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  generateAccessToken({ userId }: { userId: Types.ObjectId }) {
    const accessToken = jwt.sign({ userId }, 'jwt_secret', {
      expiresIn: '2 days',
    });

    return accessToken;
  }

  verifyToken(token: string) {
    return jwt.verify(token, 'jwt_secret') as jwt.JwtPayload;
  }
}
