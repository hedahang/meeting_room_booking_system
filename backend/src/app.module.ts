import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt_secret'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/config.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql_server_host'),
        port: configService.get('mysql_server_port'),
        username: configService.get('mysql_server_username'),
        password: configService.get('mysql_server_password'),
        database: configService.get('mysql_server_database'),
        synchronize: true,
        logging: true,
        entities: [User, Role, Permission],
        poolSize: 10,
        connectorPackage: 'mysql2',
        extra: {
          authPlugin: 'sha256_password',
        },
      }),
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
