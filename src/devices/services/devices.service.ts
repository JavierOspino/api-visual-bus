import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult, ResultSetHeader } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import { CreateDeviceDto, UpdateDateDeviceDto } from '../dtos/device.dto';

@Injectable()
export class DevicesService {
  constructor(@Inject('MYSQL') private pool: Pool) {}

  async findAll(): Promise<QueryResult> {
    const [response] = await this.pool.query('SELECT * FROM dispositivo');
    return response;
  }

  async findOne(id: number): Promise<object | QueryResult> {
    const sql: string = `SELECT * FROM dispositivo WHERE id = ${id}`;
    const [device] = await this.pool.query<QueryResult>(sql);
    if (!device[0]) {
      return {
        message: 'id incorrecto',
      };
    }
    return device[0];
  }

  async encriptedPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async create(device: CreateDeviceDto): Promise<number> {
    const sql = `INSERT INTO dispositivo 
                (referencia, estado, 
                 password, sincronizar, fecha_hora_validacion, 
                 codigo, id_cliente, grupos_id) VALUES ('${device.referencia}', 
                 '${device.estado}', '${device.password}', 
                 '${device.sincronizar}', '0', '${device.codigo}',
                 '${device.id_cliente}', '${device.grupos_id}')`;

    const [response] = await this.pool.query<QueryResult>(sql);
    return response['affectedRows'];
  }

  async findByCode(
    code: string,
    password: string,
  ): Promise<QueryResult | string> {
    const encriptedPassword: string = await this.encriptedPassword(password);

    const validPassword: boolean = await bcrypt.compare(
      password,
      encriptedPassword,
    );

    if (!validPassword) {
      return 'Invalid password!';
    }

    const [video] = await this.pool.query<QueryResult>(
      'SELECT v.* FROM dispositivo AS d INNER JOIN videos_has_grupos AS vd INNER JOIN videos AS v WHERE vd.grupos_id = d.grupos_id AND v.id = vd.videos_id AND d.codigo = ?',
      [code],
    );

    if (!video[0]) {
      return null;
    }
    return video;
  }

  async updateDate(
    code: string,
    datetime: UpdateDateDeviceDto,
  ): Promise<object> {
    const { date } = datetime;
    const sql: string = `UPDATE dispositivo SET fecha_hora_validacion = '${date}' WHERE codigo = '${code}'`;
    const [device] = await this.pool.query<ResultSetHeader>(sql);
    if (device.affectedRows == 1) {
      return { response: 'Fecha y hora actualizada' };
    }
    return { response: 'Fecha no actualizada' };
  }
}
