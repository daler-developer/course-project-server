import { Transform } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsArray()
  tags: string[];

  @IsObject()
  fields: object;
}
