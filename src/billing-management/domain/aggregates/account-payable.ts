import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AccountPayableId } from '../values/account-payable-id.value';
import { PayerIdFk } from '../values/payer-id-fk.value';
import { PayeeIdFk } from '../values/payee-id-fk.value';
import { TotalPrice } from '../values/total-price.value';
import { ParcialPrice } from '../values/parcial_price.value';

@Entity()
export class AccountPayableAggregate extends AggregateRoot {

    @PrimaryColumn('bigint', { name: 'id' })
    private id: AccountPayableId;
  

    @Column((type) => PayerIdFk, { prefix: false })
    private payerId: PayerIdFk;
  
    @Column((type) => PayeeIdFk, { prefix: false })
    private payeeId: PayeeIdFk;
  
    @Column((type) => TotalPrice, { prefix: false })
    private totalPrice: TotalPrice;
  
    @Column((type) => ParcialPrice, { prefix: false })
    private parcialPrice: ParcialPrice;

    @Column({ type: 'date', name: 'expiration_day' })
    private expirationDay: Date;
  
    constructor(
        idValue: number, 
        payerIdValue: number, 
        payeeIdValue: number, 
        totalPriceValue: number, 
        parcialPriceValue: number, 
        expirationDay: Date) {
      super();
      this.id = AccountPayableId.create(idValue);
      this.payerId = PayerIdFk.create(payerIdValue);
      this.payeeId = PayeeIdFk.create(payeeIdValue);
      this.totalPrice = TotalPrice.create(totalPriceValue);
      this.parcialPrice = ParcialPrice.create(parcialPriceValue);
      this.expirationDay = expirationDay;
    }

    public getId(): AccountPayableId {
        return this.id;
      }
    
      public getPayerId(): PayerIdFk {
        return this.payerId;
      }
    
      public getPayeeId(): PayeeIdFk {
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
  }