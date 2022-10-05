import { Transform } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateItemDto {
  @IsObject()
  fields: object;
}
