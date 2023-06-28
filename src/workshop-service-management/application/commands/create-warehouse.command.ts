export class CreateWarehouseCommand {
  constructor(
    public readonly name: string,
    public readonly country: string,
    public readonly district: string,
    public readonly addressDetail: string,
    public readonly workshopId: number,
  ) {}
}
