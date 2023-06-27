import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Account } from './account.entity';
import { Vehicle } from '../../../renting-management/domain/entities/vehicle.entity';
import { RentingOrderItem } from '../../../renting-management/domain/entities/renting-order-item.entity';
import { RentOrder } from 'src/renting-management/domain/entities/rent-order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  userName: string;

  @Column('text')
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('simple-array')
  roles: string[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  profile: Profile;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true,
    eager: true,
  })
  account: Account;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
  vehicles: Vehicle[];

  @OneToMany(() => RentingOrderItem, (rentingItem) => rentingItem.requester)
  rentingOrderItems: RentingOrderItem[];

  @OneToMany(() => RentOrder, (rentOrder) => rentOrder.renter)
  rentedItems: RentOrder[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
