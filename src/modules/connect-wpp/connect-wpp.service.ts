import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  Logger,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ConnectWppService {
  private readonly logger = new Logger(ConnectWppService.name);
  constructor(private readonly httpService: HttpService) {}

  async sendMessage() {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'https://graph.facebook.com/v15.0/111556875175038/messages',
          {
            messaging_product: 'whatsapp',
            to: '573176050989',
            type: 'template',
            template: { language: { code: 'en_US' }, name: 'hello_world' },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Bearer EAAR3xc0zaxYBALGJ4etK8oAqIxAh2YokZAxScRMEEsN8bZC9EZA9ko3hED8ZCN8ZAZAovcnF8PTLmPKcFOBOLxcFsTW3rlUpioYsmkqutfwqabFQbLMj3lMd20sJxAGJLTdPj6ehak4ZARuCOh7z3gmEwDm28QGxpHIpntb7QsKCtfYvrAc3Muc9x3voG6y11ZASRwYRaTGVDwZDZDD',
            },
          },
        )
        .pipe(
          catchError((error) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    console.log(data);

    return 'Mensaje enviado';
  }

  webhook(@Req() request: Request) {
    if (request.body.object) {
      if (
        request.body.entry &&
        request.body.entry[0].changes &&
        request.body.entry[0].changes[0] &&
        request.body.entry[0].changes[0].value.messages &&
        request.body.entry[0].changes[0].value.messages[0]
      ) {
        const phone_number_id =
          request.body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = request.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        const msg_body =
          request.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

        const responseObj = { phone_number_id, from, msg_body };
        console.log(responseObj);
        return responseObj;
      }
    }
  }

  webhookGet(@Query() query, @Res() response: Response) {
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
