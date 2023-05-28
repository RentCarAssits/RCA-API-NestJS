export class VehicleId {
  protected readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  public static of(value: number): VehicleId {
    return new VehicleId(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
