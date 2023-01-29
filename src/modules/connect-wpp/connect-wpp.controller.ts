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

  @Post('send-message-with-template')
  sendMessage(@Body() data: { phoneNumber: string; template: string }) {
    return this.connectWppService.sendMessageWithTemplate(data);
  }

  @Post('send-message-text')
  sendMessageText(@Body() data: { phoneNumber: string; text: string }) {
    return this.connectWppService.sendMessageText(data);
  }

  @Delete('delete-contact/:contactId')
  deleteContact(@Param('contactId') contactId: string) {
    return this.connectWppService.deleteContact(contactId);
  }

  @Post('webhook')
  postWebhook(@Req() request: Request) {
    return this.connectWppService.webhook(request);
  }

  @Get('webhook')
  getWebhook(@Res() response: Response, @Query() query) {
    return this.connectWppService.webhookGet(query, response);
  }

  @Post('add-contact')
  addContact(
    @Body() data: { phoneNumber: string; firtsName: string; lastName: string },
  ) {
    return this.connectWppService.addContact(data);
  }
}
