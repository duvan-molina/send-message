import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectWppModule } from './modules/connect-wpp/connect-wpp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { PhoneNumber } from './entities/phoneNumber.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '34.123.234.246',
      port: 5432,
      database: 'send-meesage-db',
      username: 'user-send-message',
      password: '0742226',
      entities: [Profile, PhoneNumber],
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
