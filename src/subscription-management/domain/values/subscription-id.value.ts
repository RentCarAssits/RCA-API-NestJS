export class SubscriptionId {
  public readonly value: number;

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