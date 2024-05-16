import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { QueryResult } from 'mysql2/promise';
import {
  CreateMasiveVideosDto,
  CreateVideoDto,
  UpdateVideoDto,
} from '../dtos/video.dto';

@Controller('videos')
export class VideosController {
  constructor(private videoService: VideosService) {}

  @Get()
  getAll(): Promise<QueryResult> {
    return this.videoService.findAll();
  }

  @Get('data')
  getData(): Promise<QueryResult> {
    return this.videoService.findAllData();
  }

  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object | QueryResult> {
    return this.videoService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateVideoDto): Promise<number> {
    return this.videoService.create(payload);
  }

  @Post('masive')
  createMasive(@Body() payload: CreateMasiveVideosDto): Promise<number> {
    return this.videoService.createMasive(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateVideoDto,
  ): Promise<string> {
    return this.videoService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<string> {
    return this.videoService.remove(+id);
  }
}
