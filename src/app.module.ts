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
      host: 'bv7cvvfbgurpcjwm9txq-postgresql.services.clever-cloud.com',
      port: 5432,
      database: 'bv7cvvfbgurpcjwm9txq',
      username: 'u4d9dijynehjnu2ngmrf',
      password: 'Jq0CwOveE1n26aPuN4BJOuGuY5hr7B',
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
