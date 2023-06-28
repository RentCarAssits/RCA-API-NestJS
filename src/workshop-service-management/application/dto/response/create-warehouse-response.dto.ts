export class CreateWarehouseResponseDTO {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country: string,
    public readonly district: string,
    public readonly addressDetail: string,
    public readonly workshopId: number,
  ) {}
}
