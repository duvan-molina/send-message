import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  Logger,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
import { PhoneNumber } from 'src/entities/phoneNumber.entity';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectWppService {
  private readonly logger = new Logger(ConnectWppService.name);
  constructor(
    @InjectRepository(Profile)
    private contactRepository: Repository<Profile>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(PhoneNumber)
    private phoneNumberRepository: Repository<PhoneNumber>,
    private readonly httpService: HttpService,
  ) {}

  async sendMessageWithTemplate(payload: {
    phoneNumber: string;
    template: string;
  }) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'https://graph.facebook.com/v15.0/111556875175038/messages',
          {
            messaging_product: 'whatsapp',
            to: payload.phoneNumber,
            type: payload.template,
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

    const res = await this.messageRepository
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values({
        phoneNumber: data?.contacts[0].input || '',
        wa_id: data.contacts[0].wa_id || '',
        messagesId: data.messages[0].id || '',
        message: 'Hello',
      })
      .execute();

    const resChat = await this.chatRepository
      .createQueryBuilder()
      .insert()
      .into(Chat)
      .values({
        messages: res.raw[0],
      })
      .execute();

    await this.contactRepository
      .createQueryBuilder()
      .insert()
      .into(PhoneNumber)
      .values({
        phoneNumber: data.contacts[0].input,
        chat: resChat.raw[0],
      })
      .execute();

    console.log('res with template ====>', data.contacts[0]);
    console.log('res with template ====>', data.messages[0]);

    return 'Mensaje enviado';
  }

  async sendMessageText(payload: { phoneNumber: string; text: string }) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'https://graph.facebook.com/v15.0/111556875175038/messages',
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: payload.phoneNumber,
            type: 'text',
            text: {
              // the text object
              preview_url: false,
              body: payload.text,
            },
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

    console.log('res ====>', { data });

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

  async addContact(data: {
    phoneNumber: string;
    firtsName: string;
    lastName: string;
  }) {
    await this.contactRepository
      .createQueryBuilder()
      .insert()
      .into(Profile)
      .values(data)
      .execute();

    return {
      messages: 'contacto guardado correctamente',
    };
  }

  async deleteContact(contactId: string) {
    await this.contactRepository
      .createQueryBuilder()
      .delete()
      .from(Profile)
      .where('id = :id', { id: contactId })
      .execute();
    return 'The Contact was successfully removing';
  }
}
