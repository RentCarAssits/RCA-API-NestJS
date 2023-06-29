export class CreateServiceItemEvent {
  constructor(
    public readonly id: number,
    public readonly serviceName: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly resources: number,
  ) {}
}
