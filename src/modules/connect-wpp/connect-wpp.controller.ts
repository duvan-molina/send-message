import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConnectWppService } from './connect-wpp.service';
import { Request, Response } from 'express';

@Controller('api/v1')
export class ConnectWppController {
  constructor(private readonly connectWppService: ConnectWppService) {}

  @Get('get-templates')
  getTemplates() {
    return this.connectWppService.getTemplates({});
  }

  @Get('get-contacts')
  getContacts() {
    return this.connectWppService.getContacts();
  }

  @Post('send-message-with-template')
  sendMessage(
    @Body()
    data: {
      phoneNumber: string;
      type: string;
      chatId?: string;
      text: string;
    },
  ) {
    return this.connectWppService.sendMessageWithTemplate(data);
  }

  @Post('send-message-text')
  sendMessageText(@Body() data: { phoneNumber: string; text: string }) {
    return this.connectWppService.sendMessageText(data);
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
