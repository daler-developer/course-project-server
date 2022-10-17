import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditCollectionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  desc: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  topic: string;

  @IsObject()
  @Transform(({ value }) => JSON.parse(value))
  fields: object;
}
