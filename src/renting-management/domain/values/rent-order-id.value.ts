export class RentOrderId {
  protected readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  public static of(value: number): RentOrderId {
    return new RentOrderId(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
