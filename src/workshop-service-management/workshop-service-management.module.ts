import { Module } from '@nestjs/common';

import { ChatController } from './api/chat/chat.controller';
import { MessageFacade } from './infrastructure/openIA/messageFacade.service';
import { OpenAIService } from './application/service/openAI-chatbot.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [MessageFacade, OpenAIService],
  exports: [],
})
export class WorkshopServiceManagementModule {}
