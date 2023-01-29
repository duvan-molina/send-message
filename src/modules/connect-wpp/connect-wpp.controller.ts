import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConnectWppService } from './connect-wpp.service';
import { Response } from 'express';

@Controller('api/v1')
export class ConnectWppController {
  constructor(private readonly connectWppService: ConnectWppService) {}

  @Post('send-message')
  sendMessage() {
    return this.connectWppService.sendMessage();
  }

  @Post('webhook')
  postWebhook(@Req() request, @Query() query, @Res() response: Response) {
    return this.connectWppService.webhook(response, request, query);
  }

  @Get('webhook')
  getWebhook(@Res() response: Response, @Query() query, @Req() request) {
    if (
      query['hub.mode'] == 'subscribe' &&
      query['hub.verify_token'] == 'token-cool'
    ) {
      return response.status(HttpStatus.ACCEPTED).send(query['hub.challenge']);
    } else {
      response.status(HttpStatus.BAD_REQUEST).send({ error: 'error' });
    }
  }
}
