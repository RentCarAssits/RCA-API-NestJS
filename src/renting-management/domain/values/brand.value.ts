import { AppNotification } from 'src/shared/application/app.notification';
import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class Brand {
  @Column('varchar', { name: 'brand' })
  protected readonly value: string;
  private static MAX_LENGTH = 30;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(name: string): Result<AppNotification, Brand> {
    const notification: AppNotification = new AppNotification();
    name = (name ?? '').trim();
    if (name === '') {
      notification.addError('brand is required', null);
    }
    if (name.length > this.MAX_LENGTH) {
      notification.addError(
        'The maximum length of an brand is ' +
          this.MAX_LENGTH +
          ' characters including spaces',
        null,
      );
    }
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    return Result.ok(new Brand(name));
  }
}
