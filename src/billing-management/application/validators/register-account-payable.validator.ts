import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterAccountPayableRequest } from '../requests/register-account-payable.request';
import { AppNotification } from 'src/shared/application/app.notification';
import { AccountPayable } from 'src/billing-management/domain/entities/account-payable.entity';


@Injectable()
export class RegisterAccountPayableValidator {
    constructor(@InjectRepository(AccountPayable) private accountPayableRepository: Repository<AccountPayable>) { }

    public async validate(
        registerAccountPaybleRequest: RegisterAccountPayableRequest
    ): Promise<AppNotification> {
        const notification: AppNotification = new AppNotification();

        const year: Date = registerAccountPaybleRequest.expirationDay || null;
        if (!year) notification.addError('Expiration Date is required', null);

        const yearRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!yearRegex.test(year.toString())) {
            notification.addError(
                'Invalid year format. Please provide a year in the format "YYYY-MM-DD"',
                null,
            );
        }

        if (notification.hasErrors()) {
            console.log('NOTIFICATION: ', notification);
            return notification;
        }
        return notification;
    }
}
