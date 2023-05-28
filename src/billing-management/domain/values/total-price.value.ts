import { Column } from "typeorm";

export class TotalPrice {
    @Column('money', { name: 'total_price' })
    private value: number

    private constructor(value: number) {
        this.value = value
    }


    public static create(value: number): TotalPrice {
        return new TotalPrice(value)
    }

    public getValue(): number {
        return this.value
    }
}