import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryName } from '../values/category-name.value';
import { Vehicle } from './vehicle.entity';
import { CategoryId } from '../values/category-id.value';

@Entity('categories')
export class Category extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: CategoryId;

  @Column((type) => CategoryName, { prefix: false })
  private readonly name: CategoryName;

  @ManyToOne(() => Vehicle, (Vehicle) => Vehicle.categories, {
    onDelete: 'CASCADE',
  })
  vehicle: Vehicle;

  public constructor(name: CategoryName) {
    super();
    this.name = name;
  }

  public getId(): CategoryId {
    return this.id;
  }

  public getName(): CategoryName {
    return this.name;
  }

  public changeId(id: CategoryId) {
    this.id = id;
  }
}
