import { AppNotification } from 'src/shared/application/app.notification';
import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class CategoryName {
  @Column('varchar', { name: 'category' })
  private readonly value: string;
  private static MAX_LENGTH = 100;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(
    category: string,
  ): Result<AppNotification, CategoryName> {
    const notification: AppNotification = new AppNotification();
    category = (category ?? '').trim();
    if (category === '') {
      notification.addError('name is required', null);
    }
    if (category.length > this.MAX_LENGTH) {
      notification.addError(
        'The maximum length of an category is ' +
          this.MAX_LENGTH +
          ' characters including spaces',
        null,
      );
    }
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    return Result.ok(new CategoryName(category));
  }
}
