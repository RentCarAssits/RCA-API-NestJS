import { Module } from '@nestjs/common';
import { TwilioController } from './api/twilio/twilio.controller';
import { TwilioFacade } from './infrastructure/twilio/twilioFacade.service';
import { TwilioMessageService } from './application/service/twilio-message.service';

@Module({
  controllers: [TwilioController],
  providers: [TwilioFacade, TwilioMessageService],
})
export class SharedModule {}
