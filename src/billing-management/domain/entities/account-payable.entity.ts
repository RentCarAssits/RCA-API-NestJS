import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AccountPayableId } from "../values/account-payable-id.value";
import { PayerIdFk } from "../values/payer-id-fk.value";
import { PayeeIdFk } from "../values/payee-id-fk.value";
import { Price } from "../values/price.value";
import { AccountPayableRegistered } from "../events/account-payable-registered.event";
import { AccountPayableUpdated } from "../events/account-payable-updated.event";

@Entity('account_payables')
export class AccountPayable extends AggregateRoot {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    public id: AccountPayableId;

    @ApiProperty()
    @Column((type) => PayerIdFk, { prefix: false })
    public payerId: PayerIdFk;

    @ApiProperty()
    @Column((type) => PayeeIdFk, { prefix: false })
    public payeeId: PayeeIdFk;

    @ApiProperty()
    @Column((type) => Price, { prefix: false })
    private price: Price;


    @ApiProperty()
    @Column('date', { name: 'expiration_date' })
    public expirationDate: Date;

    public constructor(payerId: PayerIdFk, payeeId: PayeeIdFk, price: Price, expirationDate: Date) {
        super();
        this.payerId = payerId;
        this.payeeId = payeeId;
        this.price = price;
        this.expirationDate = expirationDate;
    }

    public register() {
        const event = new AccountPayableRegistered(
            this.id.getValue(),
            this.payerId.getValue(),
            this.payeeId.getValue(),
            this.price.getTotal(),
            this.price.getParcial(),
            this.expirationDate
        );
        this.apply(event);
    }

    public updated() {
        const event = new AccountPayableUpdated(
            this.id.getValue(),
            this.payerId.getValue(),
            this.payeeId.getValue(),
            this.price.getTotal(),
            this.price.getParcial(),
            this.expirationDate
        );
        this.apply(event);
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
    public getPrice(): Price {
        return this.price;
    }
    public getExpirationDate(): Date {
        return this.expirationDate;
    }
}