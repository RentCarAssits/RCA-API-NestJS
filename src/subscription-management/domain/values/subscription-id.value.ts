export class SubscriptionId {
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): SubscriptionId {
    return new SubscriptionId(value);
  }

  public getValue(): number {
    return this.value;
  }
}