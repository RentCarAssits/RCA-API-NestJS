import { Body, Controller, Post } from '@nestjs/common';
import { MessageFacade } from 'src/workshop-service-management/infrastructure/openIA/messageFacade.service';

@Controller('chat')
export class ChatController {
  constructor(private messageFacade: MessageFacade) {}
  @Post()
  async generate(@Body('prompt') prompt: string) {
    try {
      const message = await this.messageFacade.generateText(prompt);
      return { message };
    } catch (err) {
      return { message: err };
    }
  }
}
