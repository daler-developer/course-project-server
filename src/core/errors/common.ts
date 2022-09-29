import RequestError from './RequestError';

export class ValidationError extends RequestError {
  constructor() {
    super('Validation error', 400, 'common/validation_error');
  }
}
