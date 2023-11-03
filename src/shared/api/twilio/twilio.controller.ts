import { Body, Controller, Post } from '@nestjs/common';
import { TwilioFacade } from 'src/shared/infrastructure/twilio/twilioFacade.service';

@Controller('twilio')
export class TwilioController {
  constructor(private messageFacade: TwilioFacade) {}
  @Post()
  async generate(@Body() request: any) {
    try {
      const message = await this.messageFacade.sendWsp(request);
      return { message };
    } catch (err) {
      return { message: err };
    }
  }
}
