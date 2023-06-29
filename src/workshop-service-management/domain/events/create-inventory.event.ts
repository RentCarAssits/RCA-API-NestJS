export class CreateInventoryEvent {
  constructor(
    public readonly id: number,
    public readonly description: string,
    public readonly country: string,
    public readonly district: string,
    public readonly addressDetail: string,
  ) {}
}
