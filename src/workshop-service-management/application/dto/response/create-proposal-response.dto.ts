export class CreateProposalResponseDto {
  constructor(
    public readonly id: number,
    public readonly humanResources: number,
    public readonly price: number,
    public readonly currency: string,
    public readonly start: Date,
    public readonly end: Date,
  ) {}
}
