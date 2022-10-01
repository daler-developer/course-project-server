import RequestError from './RequestError';

export class CollectionNotFoundError extends RequestError {
  constructor() {
    super('Collection not found', 404);
  }
}
