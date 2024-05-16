import { Module } from '@nestjs/common';
import { VideosController } from './controller/videos.controller';
import { VideosService } from './services/videos.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
