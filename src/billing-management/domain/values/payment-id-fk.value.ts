import { PrimaryGeneratedColumn }  from  'typeorm';
export class PaymentIdFk{
    @PrimaryGeneratedColumn('increment',{name:'payment_id'})
    protected readonly value:number;
    
    protected constructor(value:number){
        this.value=value;
    }

    public static create(value:number):PaymentIdFk{
        return new PaymentIdFk(value);
    }

    public getValue():number{
        return this.value;
    }
}