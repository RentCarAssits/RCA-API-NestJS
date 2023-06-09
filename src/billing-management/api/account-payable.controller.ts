import { Controller, Post, Body, Res, Get, Param, Delete, Put } from '@nestjs/common';
import { AccountPayableApplicationService } from '../application/services/accountPayable-application.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterAccountPayableResponse } from '../application/reponses/register-accountPayable.response';
import { AppNotification } from 'src/shared/application/app.notification';
import { RegisterAccountPayableRequest } from '../application/requests/register-accountPayable.request';
import { ApiController } from 'src/shared/api/api.controller';
import { Result } from 'typescript-result';
import { GetAllAccountPayablesQuery } from '../application/queries/get-all-account-payables-query';
import { GetAccountPayableByIdQuery } from '../application/queries/get-account-payable-by-id.query';
import { AccountPayableAggregateDeleteCommand } from '../application/commands/delete-accountPayable.command';
import { UpdateAccountPayableRequest } from '../application/requests/update-accountPayable.request';


@Controller('accountPayable')
export class AccountPayableController {
  constructor(
    private readonly accountPayableService: AccountPayableApplicationService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus

  ) { }

  @Post()
  async register(
    @Body() registerAccountPayableRequest: RegisterAccountPayableRequest,
    @Res({ passthrough: true }) response
  ): Promise<object> {
    try {
      const result: Result<AppNotification, RegisterAccountPayableResponse> =
        await this.accountPayableService.register(registerAccountPayableRequest);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get()
  async getAll(@Res({ passthrough: true }) response): Promise<object> {
    try {
      const accountPayables = await this.queryBus.execute(
        new GetAllAccountPayablesQuery()
      );
      return ApiController.ok(response, accountPayables);
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(
    @Param('id') id: number,
    @Res({ passthrough: true }) response: any
  ) {
    try {
      const accountPayable = await this.queryBus.execute(
        new GetAccountPayableByIdQuery(id)
      );
      return ApiController.ok(response, accountPayable);
    } catch (error) {
      console.log(
        '🚀 ~ file: accountPayable.controller.ts:77 ~ accountPayableController ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    };
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: number, @Res({ passthrough: true }) response: any
  ) {
    try {
      await this.commandBus.execute(new AccountPayableAggregateDeleteCommand(id));
    } catch (error) {
      console.log(
        '🚀 ~ file: accountPayable.controller.ts:77 ~ accountPayableController ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    };
  }
  @Put('/:id')
  async updateById(
    @Param('id') id: number,
    @Body() updateAccountPayableRequest: UpdateAccountPayableRequest,
    @Res({ passthrough: true }) response: any
  ) {
    try {
      const result = await this.accountPayableService.update(id, updateAccountPayableRequest);
      if (result.isSuccess()) {
        return ApiController.updated(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      console.log('🚀 ~ file: AccountPayable.controller.ts:44 ~ AccountPayableController ~ error:', error);
      return ApiController.serverError(response, error);
    }
  }
}