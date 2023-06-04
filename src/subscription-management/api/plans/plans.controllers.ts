import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/shared/api/api.controller';
import { AppNotification } from 'src/shared/application/app.notification';
import { GetAllPlanQuerys } from 'src/subscription-management/application/queries/get-all-plan.query';
import { getPlanByIdQuery } from 'src/subscription-management/application/queries/get-plan-id.queries';
import { RegisterPlanRequest } from 'src/subscription-management/application/request/register-plan.request';
import { PlanApplicationService } from 'src/subscription-management/application/service/plan-application.service';
import { Plan } from 'src/subscription-management/domain/entity/plan.entity';
import { Result } from 'typescript-result';
import { RegisterPlanResponse } from '../../application/response/register-plan.response';

@ApiTags('Plans')
@Controller('Plans')
export class PlanController {
  constructor(
    private readonly planApplicationService: PlanApplicationService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: Plan,
  })
  async register(
    @Body() registerPlanRequest: RegisterPlanRequest,
    @Res({ passthrough: true }) response: any,
  ): Promise<object> {
    try {
      console.log('request: ', registerPlanRequest);
      //const result: Result<AppNotification, RegisterPlanResponse> =
      const result: Result<AppNotification, RegisterPlanRequest> =
        await this.planApplicationService.register(registerPlanRequest);
      if (result.isSuccess()) {
        console.log('sucess ');
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      console.log('error:', error);
      return ApiController.serverError(response, error);
    }
  }

  @Get()
  async getAll(@Res({ passthrough: true }) response: any) {
    try {
      const plans = await this.queryBus.execute(new GetAllPlanQuerys());
      return ApiController.ok(response, plans);
    } catch (error) {
      console.log(
        '🚀 ~ file: vehicles.controller.ts:58 ~ VehiclesController ~ getAll ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(
    @Param('id') planId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const plan = await this.queryBus.execute(new getPlanByIdQuery(planId));
      return ApiController.ok(response, plan);
    } catch (error) {
      console.log(
        '🚀 ~ file: vehicles.controller.ts:77 ~ VehiclesController ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }
  }
}
