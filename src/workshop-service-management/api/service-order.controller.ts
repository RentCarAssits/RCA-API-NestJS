import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProposalService } from '../application/services/proposal.service';
import { QueryBus } from '@nestjs/cqrs';
import { CreateProposalDto } from '../application/dto/request/create-proposal.dto';
import { response } from 'express';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { ServiceItemService } from '../application/services/service-item.service';
import { CreateServiceItemDto } from '../application/dto/request/create-service-item.dto';
import { ProposalDto } from '../application/dto/proposal.dto';
import { ServiceOrderDto } from '../application/dto/service-order.dto';
import { ServiceOrderService } from '../application/services/service-order.service';
import { ServiceItemOrderDto } from '../application/dto/service-item-order';

@ApiTags('ServiceOrder')
@Controller('serviceOrder')
export class ServiceOrderController {
  constructor(
    private readonly serviceOrderService: ServiceOrderService,
    private readonly serviceItemService: ServiceItemService,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(@Res({ passthrough: true }) response: any) {
    try {
      const result: Result<AppNotification, ProposalDto[]> =
        await this.serviceOrderService.findAll();
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(
    @Param('id') proposalId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, ProposalDto> =
        await this.serviceOrderService.findbyId(proposalId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
  @Get('/:id/serviceItemOrders')
  @ApiOperation({ summary: 'Get Service Item Ordes by Service Orders' })
  async getAllServiceItembyProposalId(
    @Param('id') proposalId: number,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, ServiceItemOrderDto[]> =
        await this.serviceOrderService.findAllByOrderId(proposalId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
