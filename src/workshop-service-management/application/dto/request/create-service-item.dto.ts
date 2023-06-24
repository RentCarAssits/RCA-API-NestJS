import { CreateRequestItemDto } from './create-request-item.dto';
export class CreateServiceItemDto {
  constructor(
    public readonly serviceType: string,
    public readonly resources: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly proposalId: number,
  ) {}
}
