import { IsOptional, IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class CreateAccountDto extends SignInDto {
  @IsOptional()
  @IsString()
  email: string;
}
