import RequestError from './RequestError';

export class ForbiddenToCreateItemError extends RequestError {
  constructor() {
    super('Forbidden to create item', 400);
  }
}

export class AlreadyLikedItemError extends RequestError {
  constructor() {
    super('You already liked this item', 400);
  }
}

export class DidNotLikedItemError extends RequestError {
  constructor() {
    super('You did not yet liked this item', 400);
  }
}
