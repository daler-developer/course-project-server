import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  constructor(@Inject(REQUEST) private req: Request) {}

  get currentUser() {
    return this.req.user;
  }

  get isAuthenticated() {
    return !!this.currentUser;
  }
}
