export class RegisterAccountPayableResponse {
  constructor(
    public accountPayableId: number,
    public payerId: number,
    public payeeId: number,
    public serviceId: number,
    public totalPrice: number,
    public state: string,
    public expirationDay: Date,
    public currency: string,
    public tipoServicio: string
  ) { }
}