import RequestError from './RequestError';

export class UserAlreadyExistsError extends RequestError {
  constructor() {
    super('User already exists', 400);
  }
}

export class IncorrectPasswordError extends RequestError {
  constructor() {
    super('Incorrect password', 400);
  }
}

export class UserNotFoundError extends RequestError {
  constructor() {
    super('User not found', 404);
  }
}

export class NotAuthenticatedError extends RequestError {
  constructor() {
    super('Not authenticated', 403);
  }
}

export class AdminRequiredError extends RequestError {
  constructor() {
    super('Admin required', 400);
  }
}
