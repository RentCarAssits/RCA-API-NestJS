import { PrimaryColumn } from "typeorm";

export class AccountEmail {
  @PrimaryColumn({ name: 'AccountEmail' })
  protected readonly Email: string;

  protected constructor(Email: string) {
    this.Email = Email;
  }

  public static of(value: string): AccountEmail {
    return new AccountEmail(value);
  }

  public getValue(): string {
    return this.Email;
  }
}
