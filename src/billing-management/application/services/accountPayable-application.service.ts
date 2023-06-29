import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateAccountPayable } from '../commands/register-accountPayable.command';
import { RegisterAccountPayableRequest } from '../requests/register-accountPayable.request';
import { RegisterAccountPayableResponse } from '../reponses/register-accountPayable.response';
import { UpdateAccountPayableRequest } from '../requests/update-accountPayable.request';
import { UpdateAccountPayableResponse } from '../reponses/update-accountPayable.response';
import { UpdateAccountPayable } from '../commands/update-accountPayable.commnad';



@Injectable()
export class AccountPayableApplicationService {
  constructor(
    private commandBus: CommandBus
  ) { }

  async register(registerAccountPayableRequest: RegisterAccountPayableRequest): Promise<Result<AppNotification, RegisterAccountPayableResponse>> {
    const { payerId, payeeId, totalPrice, state, expirationDay } = registerAccountPayableRequest;

    const createAccountPayable: CreateAccountPayable = new CreateAccountPayable(
      registerAccountPayableRequest.payerId,
      registerAccountPayableRequest.payeeId,
      registerAccountPayableRequest.serviceId,
      registerAccountPayableRequest.totalPrice,
      registerAccountPayableRequest.state,
      registerAccountPayableRequest.expirationDay,
      registerAccountPayableRequest.currency,
      registerAccountPayableRequest.tipoServicio
    );
    const accountId: number = await this.commandBus.execute(createAccountPayable);
    const registerAccountPayableResponse: RegisterAccountPayableResponse = new RegisterAccountPayableResponse(
      accountId,
      createAccountPayable.payerId,
      createAccountPayable.payeeId,
      createAccountPayable.serviceId,
      createAccountPayable.totalPrice,
      createAccountPayable.state,
      createAccountPayable.expirationDay,
      createAccountPayable.currency,
      createAccountPayable.tipoServicio
    );

    return Result.ok(registerAccountPayableResponse);
  }

  async update(
    id: number,
    updateAccountPayableRequest: UpdateAccountPayableRequest
  ): Promise<Result<AppNotification, UpdateAccountPayableResponse>> {
    const updateAccountPayable: UpdateAccountPayable = new UpdateAccountPayable(id,
      updateAccountPayableRequest.payerId,
      updateAccountPayableRequest.payeeId,
      updateAccountPayableRequest.serviceId,
      updateAccountPayableRequest.totalPrice,
      updateAccountPayableRequest.parcialPrice,
      updateAccountPayableRequest.state,
      updateAccountPayableRequest.expirationDay,
      updateAccountPayableRequest.currency,
      updateAccountPayableRequest.tipoServicio);
    const accountId: number = await this.commandBus.execute(updateAccountPayable);
    const updateAccountPayableResponse: UpdateAccountPayableResponse =
      new UpdateAccountPayableResponse(
        accountId,
        updateAccountPayable.payerId,
        updateAccountPayable.payeeId,
        updateAccountPayable.serviceId,
        updateAccountPayable.totalPrice,
        updateAccountPayable.parcialPrice,
        updateAccountPayable.state,
        updateAccountPayable.expirationDay,
        updateAccountPayable.currency,
        updateAccountPayable.tipoServicio
      );
    return Result.ok(updateAccountPayableResponse);
  }
}