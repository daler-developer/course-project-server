import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class GetUsersDto {
  @IsNumber()
  offset: number;
}
