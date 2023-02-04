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
    type: string;
    chatId?: string;
  }) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${process.env.API_URL}/${process.env.PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            to: payload.phoneNumber,
            type: payload.type,
            template: { language: { code: 'en_US' }, name: 'hello_world' },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`,
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

    const res = await this.phoneNumberRepository.find({
      where: {
        phoneNumber: data.contacts[0].input,
      },
    });

    if (res.length > 0 && !payload?.chatId)
      return {
        errorMessage: 'ingrese un chatId',
      };

    if (res.length > 0 && payload?.chatId) {
      const restChatId = await this.chatRepository.findOneBy({
        id: payload.chatId,
      });

      await this.messageRepository
        .createQueryBuilder()
        .insert()
        .into(Message)
        .values({
          phoneNumber: data?.contacts[0].input || '',
          wa_id: data.contacts[0].wa_id || '',
          messagesId: data.messages[0].id || '',
          chat: restChatId,
          message: 'Hello 2',
        })
        .execute();

      return 'mensaje nuevo añadido';
    } else {
      const resChat = await this.chatRepository
        .createQueryBuilder()
        .insert()
        .into(Chat)
        .values({})
        .execute();

      await this.messageRepository
        .createQueryBuilder()
        .insert()
        .into(Message)
        .values({
          phoneNumber: data?.contacts[0].input || '',
          wa_id: data.contacts[0].wa_id || '',
          messagesId: data.messages[0].id || '',
          chat: resChat.raw[0],
          message: 'Hello',
        })
        .execute();

      await this.phoneNumberRepository
        .createQueryBuilder()
        .insert()
        .into(PhoneNumber)
        .values({
          phoneNumber: data.contacts[0].input,
        })
        .execute();
    }

    return 'Mensaje enviado';
  }

  async getTemplates(payload: { limit?: number }) {
    const data = await firstValueFrom(
      this.httpService
        .get(
          `${process.env.API_URL}/${
            process.env.WHATSAPP_BUSSINES_ACCOUNT_ID
          }/message_templates?limit=${payload.limit || 10}&access_token=${
            process.env.FACEBOOK_ACCESS_TOKEN
          }`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept-Encoding': '*',
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            // console.log('error', error);
            this.logger.error(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data.data;
  }

  async getContacts() {
    const data = await firstValueFrom(
      this.httpService
        .get(
          `${process.env.API_URL}/${process.env.WHATSAPP_BUSSINES_ACCOUNT_ID}/phone_numbers?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept-Encoding': '*',
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            // console.log('error', error);
            this.logger.error(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data.data;
  }

  async sendMessageText(payload: { phoneNumber: string; text: string }) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${process.env.API_URL}/${process.env.PHONE_NUMBER_ID}/messages`,
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
              Authorization: `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`,
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
      query['hub.verify_token'] == process.env.FACEBOOK_VERIFY_TOKEN
    ) {
      return response.status(HttpStatus.ACCEPTED).send(query['hub.challenge']);
    } else {
      response.status(HttpStatus.BAD_REQUEST).send({ error: 'error' });
    }
  }
}
