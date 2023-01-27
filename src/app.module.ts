import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectWppModule } from './modules/connect-wpp/connect-wpp.module';

@Module({
  imports: [ConnectWppModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
