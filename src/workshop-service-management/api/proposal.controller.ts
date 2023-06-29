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

@ApiTags('Proposal')
@Controller('proposal')
export class ProposalController {
  constructor(
    private readonly proposalService: ProposalService,
    private readonly serviceItemService: ServiceItemService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Proposal' })
  async create(
    @Body() createProposalDto: CreateProposalDto,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateProposalDto> =
        await this.proposalService.create(createProposalDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
  @Get()
  async getAll(@Res({ passthrough: true }) response: any) {
    try {
      const result: Result<AppNotification, ProposalDto[]> =
        await this.proposalService.findAll();
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
        await this.proposalService.findbyId(proposalId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Post('/:id/accept')
  async acceptProposal(
    @Param('id') proposalId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, ServiceOrderDto> =
        await this.proposalService.acceptProposal(proposalId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
