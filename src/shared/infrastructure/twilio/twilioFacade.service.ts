import { Injectable } from '@nestjs/common';
import { TwilioMessageService } from 'src/shared/application/service/twilio-message.service';


@Injectable()
export class TwilioFacade {
  constructor(private openAIService: TwilioMessageService) {}
  
  sendWsp(req: any): Promise<string> {
    return this.openAIService.sendWsp(req);
  }
}
