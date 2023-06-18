import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from 'src/shared/application/app.notification';
import { Workshop } from 'src/workshop-service-management/domain/entities/workshop.entity';
import { CreateWorkshopDTO } from '../dto/request/create-workshop.dto';
import { User } from 'src/iam-management/domain/entities/user.entity';

@Injectable()
export class CreateWorkshopValidator {
  constructor(
    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async validate(
    createWorkshopDto: CreateWorkshopDTO,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const name: string = createWorkshopDto.name;
    if (name == null) {
      notification.addError('Name is required', null);
    }
    const country: string = createWorkshopDto.country;
    if (country == null) {
      notification.addError('Country is required', null);
    }
    const district: string = createWorkshopDto.district;
    if (district == null) {
      notification.addError('District is required', null);
    }
    const addressDetail: string = createWorkshopDto.addressDetail;
    if (addressDetail == null) {
      notification.addError('Address Detail is required', null);
    }

    const ownerId: number = createWorkshopDto.ownerId;
    if (ownerId == null) {
      notification.addError('OwnerId is required', null);
    } else if (ownerId <= 0) {
      notification.addError('OwnerId is invalid ', null);
    } else {
      const owner: User = await this.userRepository
        .createQueryBuilder()
        .where('id = :ownerId', { ownerId })
        .getOne();
      console.log(owner);
      if (owner == null) {
        notification.addError(
          'User with the specified owner Id does not exist',
          null,
        );
      }
    }
    return notification;
  }
}
