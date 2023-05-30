import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn,PrimaryGeneratedColumn } from 'typeorm';
import { AccountPayableId } from '../values/account-payable-id.value';
import { PayerId } from '../values/payer-id-fk.value';
import { PayeeId } from '../values/payee-id-fk.value';
import { TotalPrice } from '../values/total-price.value';
import { ParcialPrice } from '../values/parcial_price.value';

@Entity()
export class AccountPayableAggregate extends AggregateRoot {

  @PrimaryGeneratedColumn({ name: 'id' })
    private id: AccountPayableId;
  

    @Column((type) => PayerId, { prefix: false })
    private payerId: PayerId;
  
    @Column((type) => PayeeId, { prefix: false })
    private payeeId: PayeeId;
  
    @Column((type) => TotalPrice, { prefix: false })
    private totalPrice: TotalPrice;
  
    @Column((type) => ParcialPrice, { prefix: false })
    private parcialPrice: ParcialPrice;

    @Column({ type: 'date', name: 'expiration_day' })
    private expirationDay: Date;
  
    constructor(
      payerIdValue: number,
      payeeIdValue: number,
      totalPriceValue: number,
      expirationDay: Date
    ) {
      super();
      this.payerId = PayerId.create(payerIdValue);
      this.payeeId = PayeeId.create(payeeIdValue);
      this.totalPrice = TotalPrice.create(totalPriceValue);
      this.parcialPrice = ParcialPrice.create(totalPriceValue); // parcialPrice igual a totalPrice
      this.expirationDay = expirationDay;
    }

    public getId(): AccountPayableId {
        return this.id;
      }
    
      public getPayerId(): PayerId {
        return this.payerId;
      }
    
      public getPayeeId(): PayeeId {
        return this.payeeId;
      }
    
      public getTotalPrice(): TotalPrice {
        return this.totalPrice;
      }
    
      public getParcialPrice(): ParcialPrice {
        return this.parcialPrice;
      }
    
      public getExpirationDay(): Date {
        return this.expirationDay;
      }

      public updateParcialPrice(parcialPriceValue: number): void {
        this.parcialPrice = ParcialPrice.create(parcialPriceValue);
      }
  }