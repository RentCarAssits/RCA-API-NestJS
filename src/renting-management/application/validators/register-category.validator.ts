import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterCategoryRequest } from '../requests/register-category.request';
import { AppNotification } from 'src/shared/application/app.notification';
import { Category } from 'src/renting-management/domain/entities/category.entity';


@Injectable()
export class RegisterCategoryValidator {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  public async validate(registerCategoryRequest: RegisterCategoryRequest): Promise<AppNotification> {
    let notification: AppNotification = new AppNotification();
    const name: string = registerCategoryRequest.name.trim();
    if (name.length <= 0) {
      notification.addError('Category name is required', null);
    }
    if (notification.hasErrors()) {
      return notification;
    }
    const category: Category = await this.categoryRepository.createQueryBuilder().where("name = :name", { name }).getOne();
    if (category != null) {
      notification.addError('Category name is taken', null);
    }
    return notification;
  }
}
