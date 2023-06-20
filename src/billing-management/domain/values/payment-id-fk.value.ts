import { Column } from 'typeorm';
export class PaymentIdFk {
    @Column('int', { name: 'payment_id' })
    protected readonly value: number;

    protected constructor(value: number) {
        this.value = Number(value);
    }

    public static create(value: number): PaymentIdFk {
        return new PaymentIdFk(value);
    }

    public getValue(): number {
        return Number(this.value);
    }
}