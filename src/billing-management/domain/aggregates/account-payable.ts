import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AccountPayableId } from '../values/account-payable-id.value';
import { PayerIdFk } from '../values/payer-id-fk.value';
import { PayeeIdFk } from '../values/payee-id-fk.value';
import { Price } from '../values/price.value';
import { PaymentStatus } from '../enums/payment-status.enum';
import { ServiceType } from '../enums/service-type.enum';

@Entity('account_payables')
export class AccountPayableAggregate extends AggregateRoot {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: AccountPayableId;

  @Column({ type: 'int', name: 'id_Service' })
  private readonly idService:number

  @Column((type) => PayerIdFk, { prefix: false })
  payerId: PayerIdFk;

  @Column((type) => PayeeIdFk, { prefix: false })
  payeeId: PayeeIdFk;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column({ type: 'date', name: 'expiration_day' })
  private expirationDay: Date;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  private  state: PaymentStatus;

  @Column({ type: 'varchar', name: 'currency' })
  private  currency: string;

  @Column({ type: 'enum', enum: ServiceType, default: ServiceType.SUSCRIPCION })
  private  tipoServicio: ServiceType;
  
  



  constructor(
    payerId: PayerIdFk,
    payeeId: PayeeIdFk,
    idService:number,
    price: Price,
    state: number,
    expirationDay: Date,
    currency:string,
    tipoServicio:number
  ) {
    super();
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.idService = idService;
    this.price = price;
    this.state = state;
    this.expirationDay = expirationDay;
    this.currency = currency
    this.tipoServicio = tipoServicio
  }

  public getId(): AccountPayableId {
    return this.id;
  }

  public getIdService(): number{
    return this.idService;
  }

  public getTipoServicio():ServiceType{
    return this.tipoServicio;
  }

  public getCurrency(): string{
    return this.currency;
  }

  public getPayerId(): PayerIdFk {
    return this.payerId;
  }

  public getPayeeId(): PayeeIdFk {
    return this.payeeId;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getState(): PaymentStatus {
    return this.state;
  }
  
  public getExpirationDay(): Date {
    return this.expirationDay;
  }
}