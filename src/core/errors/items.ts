import RequestError from './RequestError';

export class ForbiddenToCreateItemError extends RequestError {
  constructor() {
    super('Forbidden to create item', 400, 'items/forbidden_to_create_item');
  }
}

export class ItemNotFoundError extends RequestError {
  constructor() {
    super('Item was not found', 404, 'items/item_not_found');
  }
}

export class ForbiddenToDeleteItemError extends RequestError {
  constructor() {
    super('Forbidden to delete item', 400, 'items/forbidden_to_delete_item');
  }
}

export class ForbiddenToEditItemError extends RequestError {
  constructor() {
    super('Forbidden to edit item', 400, 'items/forbidden_to_edit_item');
  }
}

export class AlreadyLikedItemError extends RequestError {
  constructor() {
    super('You already liked this item', 400, 'items/already_liked_item');
  }
}

export class DidNotLikedItemError extends RequestError {
  constructor() {
    super(
      'You did not yet liked this item',
      400,
      'itmes/did_not_like_item_yet',
    );
  }
}
