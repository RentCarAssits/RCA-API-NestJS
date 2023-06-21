import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountPayableService } from "../application/services/account-payable.service";
import { QueryBus } from "@nestjs/cqrs";
import { Auth } from "src/iam-management/application/decorators/auth.decorator";
import { RegisterAccountPayableRequest } from "../application/requests/register-account-payable.request";
import { RegisterAccountPayableResponse } from "../application/responses/register-account-payable.response";
import { AppNotification } from "src/shared/application/app.notification";
import { Result } from "typescript-result";
import { ApiController } from "src/shared/api/api.controller";


@ApiTags('Account-Payable')
@Controller('Account-Payable')
export class AccountPayableController {
  constructor(
    private readonly accountPayableService: AccountPayableService,
    private readonly queryBus: QueryBus,
  ) { }


  @Post()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'OK',
    type: RegisterAccountPayableResponse,
  })
  async register(
    @Body() registerAccountPayableRequest: RegisterAccountPayableRequest,
    @Res({ passthrough: true }) response: any) {
    try {
      const result: Result<AppNotification, RegisterAccountPayableResponse> =
        await this.accountPayableService.register(
          registerAccountPayableRequest
        );
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      console.log(
        '🚀 ~ file: accountpayable.controller.ts:44 ~ AccountPayableController ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }
  }

}