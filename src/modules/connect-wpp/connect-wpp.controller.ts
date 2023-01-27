import { Controller, Get, Post } from '@nestjs/common';
import { ConnectWppService } from './connect-wpp.service';

@Controller('api/v1/')
export class ConnectWppController {
  constructor(private readonly connectWppService: ConnectWppService) {}

  @Post('send-message/')
  sendMessage() {
    return this.connectWppService.sendMessage();
  }

  @Get('webhook/')
  webhookgGet() {
    return this.connectWppService.webhook();
  }

  @Post('webhook/')
  webhookgPost() {
    return this.connectWppService.webhook();
  }
}
