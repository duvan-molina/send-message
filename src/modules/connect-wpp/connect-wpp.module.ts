import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConnectWppController } from './connect-wpp.controller';
import { ConnectWppService } from './connect-wpp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { PhoneNumber } from 'src/entities/phoneNumber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, PhoneNumber]), HttpModule],
  controllers: [ConnectWppController],
  providers: [ConnectWppService],
})
export class ConnectWppModule {}
