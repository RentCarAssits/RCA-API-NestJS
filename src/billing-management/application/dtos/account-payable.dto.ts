export class AccountPayableDto {
    public id: number;
    public payerId: number;
    public payeeId: number;
    public totalPrice: number;
    public parcialPrice:number;
    public state:number;
    public expirationDay: Date;
}
