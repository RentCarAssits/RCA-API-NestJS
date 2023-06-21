import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterAccountPayableValidator } from "../validators/register-account-payable.validator";
import { RegisterAccountPayableRequest } from "../requests/register-account-payable.request";
import { RegisterAccountPayableResponse } from "../responses/register-account-payable.response";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { RegisterAccountPayable } from "../commands/register-account-payable.command";

@Injectable()
export class AccountPayableService {
  constructor(
    private commandBus: CommandBus,
    private registerAccountPayableValidator: RegisterAccountPayableValidator
  ) { }

  async register(
    registerAccountPayableRequest: RegisterAccountPayableRequest,
  ): Promise<Result<AppNotification, RegisterAccountPayableResponse>> {
    const notification: AppNotification =
      await this.registerAccountPayableValidator.validate(
        registerAccountPayableRequest);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }

    const registerAccountPayable: RegisterAccountPayable =
      new RegisterAccountPayable(
        registerAccountPayableRequest.payerId,
        registerAccountPayableRequest.payeeId,
        registerAccountPayableRequest.totalPrice,
        registerAccountPayableRequest.expirationDay,
      );
    const accountPayableId: number = await this.commandBus.execute(
      registerAccountPayable,
    );
    const registerAccountPayableResponse: RegisterAccountPayableResponse =
      new RegisterAccountPayableResponse(
        accountPayableId,
        registerAccountPayable.payerId,
        registerAccountPayable.payeeId,
        registerAccountPayable.totalPrice,
        registerAccountPayable.expirationDate
      );
    return Result.ok(registerAccountPayableResponse);
  }

}