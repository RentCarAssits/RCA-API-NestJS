import { Column } from 'typeorm';
import { Result } from 'typescript-result';
import { AppNotification } from '../../../shared/application/app.notification';

export class VehicleIntegrity {
  @Column('varchar', { name: 'integrity' })
  private readonly value: string;
  private static MAX_LENGTH = 250;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(
    integrity: string,
  ): Result<AppNotification, VehicleIntegrity> {
    const notification: AppNotification = new AppNotification();
    integrity = (integrity ?? '').trim();
    if (integrity === '') {
      notification.addError('integrity field is required', null);
    }
    if (integrity.length > this.MAX_LENGTH) {
      notification.addError(
        'The maximum length of an name is ' +
          this.MAX_LENGTH +
          ' characters including spaces',
        null,
      );
    }
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    return Result.ok(new VehicleIntegrity(integrity));
  }
}
