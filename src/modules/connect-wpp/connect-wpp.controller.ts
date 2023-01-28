import { Controller, Post, Req } from '@nestjs/common';
import { ConnectWppService } from './connect-wpp.service';

@Controller('api/v1')
export class ConnectWppController {
  constructor(private readonly connectWppService: ConnectWppService) {}

  @Post('send-message')
  sendMessage() {
    return this.connectWppService.sendMessage();
  }

  @Post('webhook')
  postWebhook(@Req() request) {
    console.log(request);
    return 'hello world';
  }
}
