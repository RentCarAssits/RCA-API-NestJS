import { AppNotification } from 'src/shared/application/app.notification';
import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class Benefits {
  @Column('varchar', { name: 'Benefits' })
  private readonly value: string;
  private static MAX_LENGTH: number = 450;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }
  public static create(benefits:string): Result<AppNotification,Benefits>{
    const notification: AppNotification = new AppNotification;
    benefits=(benefits??'').trim();
    
    if (benefits === '') {notification.addError('model is required', null);}
    
    if (benefits.length > this.MAX_LENGTH) {notification.addError('The maximum length of an Benefist is '+this.MAX_LENGTH +' characters including spaces',null,);}
    
    if (notification.hasErrors()) {return Result.error(notification);}

    return Result.ok(new Benefits(benefits));
  }
}