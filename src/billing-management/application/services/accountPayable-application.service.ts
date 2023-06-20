import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateAccountPayable } from '../commands/register-accountPayable.command';
import { RegisterAccountPayableRequest } from '../requests/register-accountPayable.request';
import { RegisterAccountPayableResponse } from '../reponses/register-accountPayable.response';


@Injectable()
export class AccountPayableApplicationService {
  constructor(
    private commandBus: CommandBus
  ) {}

  async register(registerAccountPayableRequest: RegisterAccountPayableRequest): Promise<Result<AppNotification, RegisterAccountPayableResponse>> {
    const { payerId, payeeId, totalPrice, expirationDay } = registerAccountPayableRequest;

    const createAccountPayable: CreateAccountPayable = new CreateAccountPayable(
      registerAccountPayableRequest.payerId,
      registerAccountPayableRequest.payeeId,
      registerAccountPayableRequest.totalPrice,
      registerAccountPayableRequest.expirationDay,
    );      
    const accountId: number= await this.commandBus.execute(createAccountPayable);
    const registerAccountPayableResponse: RegisterAccountPayableResponse = new RegisterAccountPayableResponse(
      accountId,
      createAccountPayable.payerId,
      createAccountPayable.payeeId,
      createAccountPayable.totalPrice,
      createAccountPayable.expirationDay
    );

    return Result.ok(registerAccountPayableResponse);
  }
}