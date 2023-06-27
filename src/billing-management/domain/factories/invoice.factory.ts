import { invoice } from "../entities/invoice.entity";

export class InvoiceFactory {
    public static createFrom(
        date: Date,
        payerId: number,
        payerAddress: string,
        serviceId: number,
        totalPrice: number): invoice{
        return new invoice(
            date,
            payerId,
            payerAddress,
            serviceId,
            totalPrice);
        }


}