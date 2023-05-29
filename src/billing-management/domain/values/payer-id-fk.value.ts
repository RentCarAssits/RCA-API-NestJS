import { Column }  from  'typeorm';
export class PayerId{
    @Column('bigint',{name:'payer_id'})
    protected readonly value:number;
    
    protected constructor(value:number){
        this.value=value;
    }

    public static create(value:number):PayerId{
        return new PayerId(value);
    }

    public getValue():number{
        return this.value;
    }
}