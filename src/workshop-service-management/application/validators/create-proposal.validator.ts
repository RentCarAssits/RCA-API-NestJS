import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from 'src/workshop-service-management/domain/entities/proposal.entity';
import { Repository } from 'typeorm';
import { CreateProposalDto } from '../dto/request/create-proposal.dto';
import { AppNotification } from 'src/shared/application/app.notification';
import { ServiceItem } from '../../domain/entities/service-item.entity';

@Injectable()
export class CreateProposalValidator {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    @InjectRepository(ServiceItem)
    private serviceItems: Repository<ServiceItem>,
  ) {}

  public async validate(
    createProposalDto: CreateProposalDto,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const humanResources: number = createProposalDto.humanResources;
    if (humanResources == null) {
      notification.addError('Human Resources is required', null);
    }
    const quantity: number = createProposalDto.quantity;
    if (quantity == null) {
      notification.addError('Quantity is required', null);
    }
    const currency: string = createProposalDto.currency;
    if (currency == null) {
      notification.addError('Currency is required', null);
    }
    const start: Date = createProposalDto.start;
    if (start == null) {
      notification.addError('Start is required', null);
    }
    const end: Date = createProposalDto.end;
    if (end == null) {
      notification.addError('End is required', null);
    }

    return notification;
  }
}
