import { AppNotification } from "src/shared/application/app.notification";
import { Column } from "typeorm";
import { Result } from "typescript-result";

export class SubscriptionFrequency {
  @Column('varchar', {name:'frequency'})
  private readonly value: string;
  private static MAX_LENGTH: number = 250;
  private constructor(value: string) {
    this.value = value;
  }
  public getValue(): string {
    return this.value;
  }

  public static create(frequency: string): Result<AppNotification, SubscriptionFrequency> {
    const notification: AppNotification = new AppNotification();
    frequency = (frequency ?? '').trim();
    if (frequency === '') {
      notification.addError('frequency is required', null);
    }
    if (frequency.length > this.MAX_LENGTH) {
      notification.addError(
        'The maximum length of an frequency is ' +
          this.MAX_LENGTH +
          ' characters including spaces',
        null,
      );
    }
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    return Result.ok(new SubscriptionFrequency(frequency));
  }

}