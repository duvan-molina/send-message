import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectWppModule } from './modules/connect-wpp/connect-wpp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { PhoneNumber } from './entities/phoneNumber.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      entities: [Profile, PhoneNumber, Chat, Message],
      synchronize: true,
    }),
    ConnectWppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
