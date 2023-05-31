export class AccountId {
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): AccountId {
    return new AccountId(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}