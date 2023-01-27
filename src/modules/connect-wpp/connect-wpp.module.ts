import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConnectWppController } from './connect-wpp.controller';
import { ConnectWppService } from './connect-wpp.service';

@Module({
  imports: [HttpModule],
  controllers: [ConnectWppController],
  providers: [ConnectWppService],
})
export class ConnectWppModule {}
