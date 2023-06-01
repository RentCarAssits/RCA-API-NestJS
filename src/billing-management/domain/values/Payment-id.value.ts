export class PaymentId {
    private readonly value: number;

    private constructor(value: number) {
        this.value = Number(value);
    }

    public static create(value: number): PaymentId {
        return new PaymentId(value);
    }

    public getValue(): number {
        return this.value;
    }

}

