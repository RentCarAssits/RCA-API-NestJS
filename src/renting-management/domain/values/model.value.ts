import { AppNotification } from 'src/shared/application/app.notification';
import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class Model {
  @Column('varchar', { name: 'model' })
  protected readonly value: string;
  private static MAX_LENGTH = 30;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(name: string): Result<AppNotification, Model> {
    const notification: AppNotification = new AppNotification();
    name = (name ?? '').trim();
    if (name === '') {
      notification.addError('model is required', null);
    }
    if (name.length > this.MAX_LENGTH) {
      notification.addError(
        'The maximum length of an model is ' +
          this.MAX_LENGTH +
          ' characters including spaces',
        null,
      );
    }
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    return Result.ok(new Model(name));
  }
}
