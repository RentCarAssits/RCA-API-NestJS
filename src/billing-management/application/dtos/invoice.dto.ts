export class InvoiceDto{
    public id: number;
    public date:Date;
    public payerId:number;
    public serviceId:number;
    public address:string;
    public totalPrice:number;
}