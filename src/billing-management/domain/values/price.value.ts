import { Column } from "typeorm";

export class Price {
    
    private value: number

    private constructor(value: number) {
        this.value = value
    }

    public static create(value: number): Price {
        return new Price(value)
    }

    public getValue(): number {
        return this.value
    }
}