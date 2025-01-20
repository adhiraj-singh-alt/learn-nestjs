import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class User extends CreateUserDto {
  @IsInt()
  id: number;

  @IsUUID()
  uuid: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export class UserDto extends OmitType(User, ['password']) {}
