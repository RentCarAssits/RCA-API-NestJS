import { Column } from "typeorm";
export class Amount {
    @Column('decimal', { name: 'amount' })
    private value: number;
    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): Amount {
        return new Amount(value);
    }

    public getValue(): number {
        return this.value;
    }
}