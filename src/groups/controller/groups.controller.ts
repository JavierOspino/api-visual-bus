import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GroupsService } from '../service/groups.service';
import { QueryResult } from 'mysql2/promise';
import { CreateGroupDto, UpdateGroupDto } from '../dtos/group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @Get()
  getAll(): Promise<QueryResult> {
    return this.groupService.findAll();
  }

  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object | QueryResult> {
    return this.groupService.findOne(+id);
  }

  @Post()
  create(@Body() payload: CreateGroupDto): Promise<number> {
    return this.groupService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateGroupDto,
  ): Promise<string> {
    return this.groupService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<string> {
    return this.groupService.remove(+id);
  }
}
