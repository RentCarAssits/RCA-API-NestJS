import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Subscription } from "rxjs";
import { ApiController } from "src/shared/api/api.controller";
import { AppNotification } from "src/shared/application/app.notification";
import { getAllSubscriptionQuery } from "src/subscription-management/application/queries/get-all-subscription.query";
import { getSubscriptionByIdQuery } from "src/subscription-management/application/queries/get-subscription-id.query";
import { RegisterSubscriptionRequest } from "src/subscription-management/application/request/register-subscription.request";
import { RegisterSubscriptionResponse } from "src/subscription-management/application/response/register-subscription.response";
import { subscriptionApplicationService } from "src/subscription-management/application/service/subscription-application.service";
import { Result } from "typescript-result";

@ApiTags('Subscription')
@Controller('Subscriptions')
export class SubscriptionController{
    constructor(
        private readonly subscriptionApplicationService: subscriptionApplicationService,
        private readonly queryBus: QueryBus,
      ) {}

    @Post()
    @ApiResponse({
        status: 201,
        description: 'OK',
        type: Subscription,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbiden. Token Related' })
    @ApiResponse({ status: 500, description: 'Ups! Something Bad Happende' })
    async register(@Body() registerSubscriptionRequest: RegisterSubscriptionRequest, @Res({ passthrough: true }) response,) {
        try {
          const result: Result<AppNotification, RegisterSubscriptionResponse> =
          await this.subscriptionApplicationService.register(registerSubscriptionRequest);
          
          if (result.isSuccess()) {
            return ApiController.created(response, result.value);
          }
          return ApiController.error(response, result.error.getErrors());
        } 
        catch (error) {
          console.log(
            '🚀 ~ file: vehicles.controller.ts:44 ~ VehiclesController ~ error:',
            error,
          );
          return ApiController.serverError(response, error);
        }
    }
    
    @Get()
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbiden. Token Related' })
    @ApiResponse({ status: 500, description: 'Ups! Something Bad Happende' })
    async getAll(@Res({ passthrough: true }) response) {
        try {
          const subscriptions = await this.queryBus.execute(new getAllSubscriptionQuery());
          return ApiController.ok(response, subscriptions);
        } catch (error) {
          console.log(
            '🚀 ~ file: subscriptions.controller.ts:58 ~ VehiclesController ~ getAll ~ error:',
            error,
          );
          return ApiController.serverError(response, error);
        }
    }

    @Get('/:id')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbiden. Token Related' })
    @ApiResponse({ status: 500, description: 'Ups! Something Bad Happende' })
    async getById(@Param('id') subscriptionId: number,@Res({ passthrough: true }) response,) {
        try {
        const subscription = await this.queryBus.execute(
            new getSubscriptionByIdQuery(subscriptionId),
        );
        return ApiController.ok(response, subscription);
        } catch (error) {
        console.log(
            '🚀 ~ file: vehicles.controller.ts:77 ~ VehiclesController ~ error:',
            error,
        );
        return ApiController.serverError(response, error);
        }
    }

}