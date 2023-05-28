import { PrimaryColumn } from "typeorm";

export class PaymentId {
    @PrimaryColumn('bigint',{name: 'id'})
    private readonly value: number;

    constructor(value: number) {
        this.value = Number(value);
    }

    public static create(value: number): PaymentId {
        const paymentId = new PaymentId(value);
        return paymentId;
    }

    public getValue(): number {
        return this.value;
    }

}