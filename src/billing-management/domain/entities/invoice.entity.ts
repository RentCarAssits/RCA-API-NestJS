import { AggregateRoot } from "@nestjs/cqrs";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('invoice')
export class invoice extends AggregateRoot {
    @PrimaryGeneratedColumn({ name: 'id' })
    private id: number;

    @Column({ type: 'date', name: 'date' })
    private date: Date;

    @Column({ type: 'int', name: 'payer_id' })
    private payerId: number;

    @Column({ type: 'varchar', name: 'payer_address' })
    private payerAddress: string;

    @Column({ type: 'int', name: 'service_id' })
    private serviceId: number;

    @Column({ type: 'float', name: 'total_price' })
    private totalPrice: number;

    constructor(
        date: Date,
        payerId: number,
        payerAddress: string,
        serviceId: number,
        totalPrice: number) {
        super();
        this.date = date;
        this.payerId = payerId;
        this.payerAddress = payerAddress;
        this.serviceId = serviceId;
        this.totalPrice = totalPrice;
    }

    public getId() {
        return this.id;
    }
    public getDate() {
        return this.date;
    }
    public getPayerId() {
        return this.payerId;
    }
    public getPayerAddress() {
        return this.payerAddress;
    }
    public getServiceId() {
        return this.serviceId;
    }
    public getTotalPrice() {
        return this.totalPrice;
    }
}