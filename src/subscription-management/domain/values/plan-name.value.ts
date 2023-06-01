import { AppNotification } from "src/shared/application/app.notification";
import { Result } from "typescript-result";

export class PlanName {
  private readonly value: string;
  private static MAX_LENGTH: number = 250;
  private constructor(value: string) {
    this.value = value;
  }
  public getValue(): string {
    return this.value;
  }

  public static create(planname: string): Result<AppNotification, PlanName> {
    const notification: AppNotification = new AppNotification();
    planname = (planname ?? '').trim();
    if (planname === '') {
      notification.addError('name is required', null);
    }
    if (planname.length > this.MAX_LENGTH) {
      notification.addError(
        'The maximum length of an planname is ' +
          this.MAX_LENGTH +
          ' characters including spaces',
        null,
      );
    }
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    return Result.ok(new PlanName(planname));
  }

}