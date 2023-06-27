import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAIApi;
  private CONTEXT =
    'Eres un asistende de mecanicos de La plataforma RenCarAssits:';
  private CONTEXT_INSTRUCTION = 'Basado en este contexto:';
  private INSTRUCTION = `responde a las preguntas realcionadas a vehiculos, mantenimiento y temas realcionados a tu rol, si te pregunta otra cosa no respondas`;

  constructor() {
    const config = new Configuration({
      apiKey: process.env.API_TOKEN,
    });

    this.openai = new OpenAIApi(config);
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${this.CONTEXT_INSTRUCTION}\n\n\nContext: "${this.CONTEXT}" \n\n\n${this.INSTRUCTION} \n\n\n ${prompt}`,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 200,
    });

    return response.data.choices[0].text;
  }
}
