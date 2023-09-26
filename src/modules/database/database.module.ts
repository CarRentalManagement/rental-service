import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IConfig } from 'config';

import { ConfigModule } from '@microservice-auth/module-config/config.module';
import { CONFIG } from '@microservice-auth/module-config/config.provider';

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
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
