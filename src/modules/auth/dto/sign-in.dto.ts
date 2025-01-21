import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be greater than 6 characters' })
  password: string;
}
