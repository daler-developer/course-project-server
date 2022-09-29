import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeThemeDto {
  @IsString()
  theme: string;
}
