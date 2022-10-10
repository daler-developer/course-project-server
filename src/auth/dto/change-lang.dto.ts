import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeTLangDto {
  @IsString()
  lang: string;
}
