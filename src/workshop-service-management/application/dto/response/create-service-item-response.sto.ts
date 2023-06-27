export class CreateServiceItemResponseDto {
  constructor(
    public readonly id: number,
    public readonly serviceType: string,
    public readonly resources: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly proposalId: number,
  ) {}
}
