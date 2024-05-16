import { Module } from '@nestjs/common';
import { GroupsService } from './service/groups.service';
import { GroupsController } from './controller/groups.controller';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
