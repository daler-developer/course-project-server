import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationError } from '../errors/common';
import * as yup from 'yup';

@Injectable()
export class ParseOffsetPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata) {
    const offset = yup.number().min(0).optional().default(0);

    try {
      const validated = offset.validateSync(value);

      return validated;
    } catch (e) {
      throw new ValidationError();
    }
  }
}
