import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterRentOrder } from '../../commands/register-rent-order.command';
import { RentingOrderItem } from 'src/renting-management/domain/entities/renting-order-item.entity';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { RentOrder } from 'src/renting-management/domain/entities/rent-order.entity';
import { RentOrderFactory } from 'src/renting-management/domain/factories/rent-order.factory';
import { RentOrderId } from 'src/renting-management/domain/values/rent-order-id.value';

@CommandHandler(RegisterRentOrder)
export class RegisterRentOrderHandler
  implements ICommandHandler<RegisterRentOrder>
{
  constructor(
    @InjectRepository(RentOrder)
    private rentOrderRepository: Repository<RentOrder>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RentingOrderItem)
    private rentingOrderItemRepository: Repository<RentingOrderItem>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: RegisterRentOrder) {
    let rentOrderId = 0;

    const renter = await this.userRepository.findOneBy({
      id: command.renterId,
    });

    const items = await this.rentingOrderItemRepository.findByIds(
      command.items,
    );
    if (!renter || items.length !== command.items.length) {
      console.log('error');
      return rentOrderId;
    }

    let rentOrderEntity: RentOrder = RentOrderFactory.createFrom(
      command.state,
      renter,
      items,
    );

    console.log(
      '🚀 ~ file: register-rent-order.handler.ts:44 ~ execute ~ rentOrderEntity:',
      rentOrderEntity,
    );
    let rentOrder = await this.rentOrderRepository.save(rentOrderEntity);

    rentOrderId = Number(rentOrder.getId());
    console.log('rentOrderId:', rentOrderId);

    rentOrder.changeId(RentOrderId.of(rentOrderId));
    rentOrder = this.publisher.mergeObjectContext(rentOrder);
    rentOrder.register();
    rentOrder.commit();
    return rentOrderId;
  }
}
