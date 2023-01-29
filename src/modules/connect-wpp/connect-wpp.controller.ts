import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ConnectWppService } from './connect-wpp.service';
import { Request, Response } from 'express';

@Controller('api/v1')
export class ConnectWppController {
  constructor(private readonly connectWppService: ConnectWppService) {}

  @Post('send-message')
  sendMessage() {
    return this.connectWppService.sendMessage();
  }

  @Post('webhook')
  postWebhook(@Req() request: Request) {
    return this.connectWppService.webhook(request);
  }

  @Get('webhook')
  getWebhook(@Res() response: Response, @Query() query) {
    return this.connectWppService.webhookGet(query, response);
  }
}
