import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { response } from "express";
import { ApiController } from "src/shared/api/api.controller";
import { AppNotification } from "src/shared/application/app.notification";
import { GetAllPlanQuerys } from "src/subscription-management/application/queries/get-all-plan.query";
import { getPlanByIdQuery } from "src/subscription-management/application/queries/get-plan-id.queries";
import { RegisterPlanRequest } from "src/subscription-management/application/request/register-plan.request";
import { RegisterPlanResponse } from "src/subscription-management/application/response/register-plan.response";
import { PlanApplicationService } from "src/subscription-management/application/service/plan-application.service";
import { Plan } from "src/subscription-management/domain/entity/plan.entity";
import { Result } from "typescript-result";


@ApiTags('Plans')
@Controller('Plans')
export class VehiclesController{
    constructor(
        private readonly planApplicationService:PlanApplicationService,
        private readonly queryBus: QueryBus,
    ){}

    @Post()
    @ApiResponse({
        status:200,
        description:'OK',
        type:Plan,
    }
    )
    async register(@Body() registerPlanRequest: RegisterPlanRequest,@Res({ passthrough: true }) response: any,){
        try{
            const result: Result<AppNotification, RegisterPlanResponse>= await this.planApplicationService.register(registerPlanRequest);
            if(result.isSuccess()){
                return ApiController.created(response,result.value);
            }
            return ApiController.error(response,result.error.getErrors());
        } catch(error){
            console.log(
                '🚀 ~ file: vehicles.controller.ts:44 ~ VehiclesController ~ error:',
                error,    
            );
            return ApiController.serverError(response,error);
        }
    }

    @Get()
    async getAll(@Res({passthrough:true}) response:any){
        try{
            const plans = await this.queryBus.execute(new GetAllPlanQuerys());
            return ApiController.ok(response,plans);
        }   catch(error){
            console.log(
                '🚀 ~ file: vehicles.controller.ts:58 ~ VehiclesController ~ getAll ~ error:',
                error,
            );
            return ApiController.serverError(response,error);
        }
    }

    @Get('/:id')
    async getById(@Param('id') planId:Number, @Res({passthrough:true}) response:any){
        try{
            const plan = await this.queryBus.execute( new getPlanByIdQuery(planId));
            return ApiController.ok(response,plan);
        }catch(error){
            console.log(
                '🚀 ~ file: vehicles.controller.ts:77 ~ VehiclesController ~ error:',
                error,
              );
            return ApiController.serverError(response,error);
        }
    }
    
}