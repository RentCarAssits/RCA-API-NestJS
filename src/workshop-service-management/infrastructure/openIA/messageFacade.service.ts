import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'src/workshop-service-management/application/service/openAI-chatbot.service';

@Injectable()
export class MessageFacade {
  constructor(private openAIService: OpenAIService) {}
  
  generateText(input: string): Promise<string> {
    return this.openAIService.generateText(input);
  }
}
