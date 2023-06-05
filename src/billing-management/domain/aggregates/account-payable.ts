  import { AggregateRoot } from '@nestjs/cqrs';
  import { Column, Entity, PrimaryColumn,PrimaryGeneratedColumn } from 'typeorm';
  import { AccountPayableId } from '../values/account-payable-id.value';
  import { PayerIdFk } from '../values/payer-id-fk.value';
  import { PayeeIdFk } from '../values/payee-id-fk.value';
  import { Price } from '../values/price.value';

  @Entity()
  export class AccountPayableAggregate extends AggregateRoot {

    @PrimaryGeneratedColumn({ name: 'id' })
      private id: AccountPayableId;
    

      @Column((type) => PayerIdFk, { prefix: false })
      private payerId: PayerIdFk;
    
      @Column((type) => PayeeIdFk, { prefix: false })
      private payeeId: PayeeIdFk;
    
      @Column({ type: 'number', name: "total_price" })
      private totalPrice: Price;
    
      @Column({ type: 'number', name: "parcial_price" })
      private parcialPrice: Price;

      @Column({ type: 'date', name: 'expiration_day' })
      private expirationDay: Date;
    
      constructor(
        payerIdValue: PayerIdFk,
        payeeIdValue: PayeeIdFk,
        totalPriceValue: Price,
        expirationDay: Date
      ) {
        super();
        this.payerId=payerIdValue;
        this.payeeId = payeeIdValue;
        this.totalPrice = totalPriceValue;
        this.parcialPrice = totalPriceValue; // parcialPrice igual a totalPrice
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
      
        public getTotalPrice(): Price {
          return this.totalPrice;
        }
      
        public getParcialPrice(): Price {
          return this.parcialPrice;
        }
      
        public getExpirationDay(): Date {
          return this.expirationDay;
        }

        
    }