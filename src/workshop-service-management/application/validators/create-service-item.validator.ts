import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from 'src/workshop-service-management/domain/entities/service-request.entity';
import { Repository } from 'typeorm';
import { ServiceRequestDto } from '../dto/request/service-request.dto';
import { AppNotification } from 'src/shared/application/app.notification';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Workshop } from 'src/workshop-service-management/domain/entities/workshop.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { CreateRequestItemDto } from '../dto/request/create-request-item.dto';
import { ServiceItem } from 'src/workshop-service-management/domain/entities/service-item.entity';
import { Product } from 'src/workshop-service-management/domain/entities/product.entity';
import { CreateServiceItemDto } from '../dto/request/create-service-item.dto';
import { Proposal } from '../../domain/entities/proposal.entity';

@Injectable()
export class CreateServicetItemValidator {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
  ) {}

  public async validate(
    createServiceItemDto: CreateServiceItemDto,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const serviceType: string = createServiceItemDto.serviceType;
    if (serviceType === null) {
      notification.addError('Service Type is required', null);
    }
    const amount: number = createServiceItemDto.amount;
    if (amount == null) {
      notification.addError('Amount is required', null);
    }
    const currency: string = createServiceItemDto.currency;
    if (currency == null) {
      notification.addError('Currency is required', null);
    }

    const proposalId: number = createServiceItemDto.proposalId;
    if (proposalId == null) {
      notification.addError('Product id is required', null);
    } else if (proposalId <= 0) {
      notification.addError('Product Id is invalid ', null);
    } else {
      const proposal: Proposal = await this.proposalRepository
        .createQueryBuilder()
        .where('id = :proposalId', { proposalId })
        .getOne();
      if (proposal == null) {
        notification.addError(
          'Proposal with the specified Id does not exist',
          null,
        );
      }
    }
    return notification;
  }
}
