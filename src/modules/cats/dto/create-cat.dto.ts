import { OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomUUID, UUID } from 'crypto';

export class CreateCatDto {
  @IsUUID()
  @IsOptional()
  id: UUID = randomUUID();

  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}

export class UpdateCatDto extends PartialType(OmitType(CreateCatDto, ['id'] as const)) {}
