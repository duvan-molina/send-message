import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
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
            to: '573216972009',
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

  webhook() {
    return 1435442907;
  }
}
