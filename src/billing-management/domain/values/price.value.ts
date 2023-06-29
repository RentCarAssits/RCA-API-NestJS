import { Column } from "typeorm"

export class Price {
    @Column('float', { name: 'total_price' })
    private value: number;
    @Column('float', { name: 'parcial_price' })
    private parcial: number;

    private constructor(value: number, parcial:number) {
        this.value = value;
        this.parcial=parcial;
    }

    public static create(value: number, parcial:number): Price {
        return new Price(value,parcial);
    }

    public getValue(): number {
        return this.value
    }

    public getParcial():number{
        return this.parcial
    }
}