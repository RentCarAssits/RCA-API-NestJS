import { CreateServiceItemDto } from './create-service-item.dto';

export class CreateProposalDto {
  constructor(
    public readonly humanResources: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly start: Date,
    public readonly end: Date,
  ) {}
}
