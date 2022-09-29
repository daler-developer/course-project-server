import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginBodyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
