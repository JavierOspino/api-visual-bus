import { Inject, Injectable } from '@nestjs/common';
import { QueryResult, Pool } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import {
  CreateMasiveVideosDto,
  CreateVideoDto,
  UpdateVideoDto,
} from '../dtos/video.dto';

@Injectable()
export class VideosService {
  constructor(@Inject('MYSQL') private pool: Pool) {}

  async findAll(): Promise<QueryResult> {
    const [videos] = await this.pool.query('SELECT * FROM videos');
    return videos;
  }

  async findOne(id: number): Promise<object | QueryResult> {
    const sql: string = `SELECT * FROM videos WHERE id = ${id}`;
    const [video] = await this.pool.query<QueryResult>(sql);
    if (!video[0]) {
      return {
        message: 'id incorrecto',
      };
    }
    return video[0];
  }

  async findAllData(): Promise<QueryResult> {
    const [data] = await this.pool.query(
      `SELECT * FROM datos_dispositivo_video`,
    );
    return data;
  }

  async encriptedPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async create(video: CreateVideoDto): Promise<number> {
    const sql = `INSERT INTO videos 
                (codigo, referencia, estado, 
                 nombre, url) VALUES ('${video.codigo}','${video.referencia}',
                 0, '${video.nombre}', '${video.url}')`;
    const [response] = await this.pool.query<QueryResult>(sql);
    return response['affectedRows'];
  }

  async createMasive(videos: CreateMasiveVideosDto): Promise<number> {
    try {
      const values = videos.map((obj) => [
        obj.codigo_dispositivo,
        obj.codigo_video,
        obj.fecha_hora_reproduccion,
      ]);

      const sql = `INSERT INTO datos_dispositivo_video (codigo_dispositivo, 
                  codigo_video, fecha_hora_reproduccion) VALUES ?`;

      const [response] = await this.pool.query<QueryResult>(sql, [values]);

      console.log('Datos insertados correctamente.');

      return response['affectedRows'];
    } catch (error) {
      console.log({ error });
      return error;
    }
  }

  async update(id: number, data: UpdateVideoDto): Promise<string> {
    const index = await this.findOne(id);

    if (!index) {
      return 'Video not found!';
    }

    const [response] = await this.pool.query(
      `UPDATE videos SET ? WHERE id = '${id}'`,
      [data],
    );

    return response['affectedRows'] > 0
      ? 'Video updated!'
      : 'Error updating video!';
  }

  async remove(id: number): Promise<string> {
    const index = await this.findOne(id);

    if (!index) {
      return 'Video not found!';
    }

    const [response] = await this.pool.query(
      `UPDATE videos SET estado = 0 WHERE id = '${id}'`,
    );

    return response['affectedRows'] > 0
      ? 'Video deleted!'
      : 'Error deleting video!';
  }
}
