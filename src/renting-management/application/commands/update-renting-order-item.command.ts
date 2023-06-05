export class UpdateRentingOrderItemCommand {
  constructor(public readonly id: number, public readonly state: string) {}
}
