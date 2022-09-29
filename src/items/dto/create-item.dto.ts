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

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string;

  @IsArray()
  tags: string[];
}
