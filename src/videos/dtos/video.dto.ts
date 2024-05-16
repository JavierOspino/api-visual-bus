import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  readonly codigo: string;

  @IsString()
  @IsNotEmpty()
  readonly referencia: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly estado: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;
}

class VideoData {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  readonly codigo_dispositivo: string;

  @IsString()
  readonly codigo_video: string;

  @IsString()
  readonly fecha_hora_reproduccion: string;
}

export class CreateMasiveVideosDto {
  [x: string]: any;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  data: VideoData[];
}

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}
