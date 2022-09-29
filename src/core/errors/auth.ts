import RequestError from './RequestError';

export class UserAlreadyExistsError extends RequestError {
  constructor() {
    super('User already exists', 400, 'users/user_already_exists');
  }
}

export class IncorrectPasswordError extends RequestError {
  constructor() {
    super('Incorrect password', 400, 'auth/incorrect_password');
  }
}

export class UserNotFoundError extends RequestError {
  constructor() {
    super('User not found', 404, 'users/user_not_found');
  }
}

export class NotAuthenticatedError extends RequestError {
  constructor() {
    super('Not authenticated', 401, 'auth/not_authenticated');
  }
}

export class AdminRequiredError extends RequestError {
  constructor() {
    super('Admin required', 400, 'auth/admin_required');
  }
}

export class UserBlockedError extends RequestError {
  constructor() {
    super('User was blocked', 400, 'auth/user_blocked');
  }
}
