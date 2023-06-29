export class UpdateAccountPayableResponse {
    constructor(
        public id: number,
        public payerId: number,
        public payeeId: number,
        public serviceId: number,
        public totalPrice: number,
        public parcialPrice: number,
        public state: string,
        public expirationDay: Date,
        public currency: string,
        public tipoServicio: string) { }
}