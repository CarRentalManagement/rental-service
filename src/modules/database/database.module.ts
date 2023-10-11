import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IConfig } from 'config';

import { ConfigModule } from '@microservice-vehicle/module-config/config.module';
import { CONFIG } from '@microservice-vehicle/module-config/config.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [CONFIG],
      useFactory: (configService: IConfig) => ({
        ...configService.get<{
          host: string;
          port: number;
          username: string;
          password: string;
          database: string;
        }>('postgresql'),
        type: 'postgres',
        entities: ['dist/**/*.entity.js'],
        synchronize:
          configService.get<string>('env') === 'production' ? false : true,
        logging:
          configService.get<string>('env') === 'production'
            ? ['warn', 'error']
            : true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
