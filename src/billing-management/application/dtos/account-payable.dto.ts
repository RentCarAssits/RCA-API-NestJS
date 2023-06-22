export class AccountPayableDto {
    public id: number;
    public payerId: number;
    public payeeId: number;
    public price: number;
    public expirationDay: Date;
}
