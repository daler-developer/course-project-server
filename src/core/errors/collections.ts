import RequestError from './RequestError';

export class CollectionNotFoundError extends RequestError {
  constructor() {
    super('Collection not found', 404, 'collections/collection_not_found');
  }
}

export class ForbiddenToDeleteCollectionError extends RequestError {
  constructor() {
    super(
      'Collection is forbidden to delete',
      400,
      'collections/forbidden_to_delete',
    );
  }
}
