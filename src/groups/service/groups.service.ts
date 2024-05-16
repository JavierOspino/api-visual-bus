import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'mysql2/promise';
import { CreateGroupDto, UpdateGroupDto } from '../dtos/group.dto';

@Injectable()
export class GroupsService {
  constructor(@Inject('MYSQL') private pool: Pool) {}

  async findAll(): Promise<QueryResult> {
    const [groups] = await this.pool.query('SELECT * FROM grupos');
    return groups;
  }

  async findOne(id: number): Promise<object | QueryResult> {
    const sql: string = `SELECT * FROM grupos WHERE id = ${id}`;
    const [group] = await this.pool.query<QueryResult>(sql);
    if (!group[0]) {
      return {
        message: 'Id incorrecto',
      };
    }
    return group[0];
  }

  async create(group: CreateGroupDto): Promise<number> {
    const sql = `INSERT INTO grupos 
                (Nombre, Estado, Codigo) VALUES ('${group.Nombre}','${group.Estado}', 
                '${group.Codigo}')`;
    const [response] = await this.pool.query<QueryResult>(sql);
    return response['affectedRows'];
  }

  async update(id: number, data: UpdateGroupDto): Promise<string> {
    const index = await this.findOne(id);

    if (!index) {
      return 'Group not found!';
    }

    const [response] = await this.pool.query(
      `UPDATE grupos SET ? WHERE id = '${id}'`,
      [data],
    );

    return response['affectedRows'] > 0
      ? 'Group updated!'
      : 'Error updating group!';
  }

  async remove(id: number): Promise<string> {
    const index = await this.findOne(id);

    if (!index) {
      return 'Group not found!';
    }

    const [response] = await this.pool.query(
      `UPDATE grupos SET Estado = 0 WHERE id = '${id}'`,
    );

    return response['affectedRows'] > 0
      ? 'Group deleted!'
      : 'Error deleting group!';
  }
}
