import { Column } from "typeorm";

export class ParcialPrice {
    private value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): ParcialPrice {
        return new ParcialPrice(value);
    }

    public getValue(): number {
        return this.value;
    }
}