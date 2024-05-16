import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  readonly Nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly Estado: string;

  @IsString()
  @IsNotEmpty()
  readonly Codigo: string;
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
