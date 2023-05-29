import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanId } from "../values/plan-id.value";
import { PlanName } from "../values/plan-name.value";
import { Benefits } from "../values/benefits.value";

@Entity('Plans')
export class Plan extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  private id: PlanId;

  @ApiProperty()
  @Column(() => PlanName, { prefix: false })
  private readonly PlanName: PlanName;

  /*
  @ApiProperty()
  @OneToMany(()=> Benefits, (Benefits)=> Benefits.getValue,{
    cascade:true,
    eager:true,
  })  
  benefits?: Benefits[];
*/ 
  // aun no tengo claro como relacionarlo

  public constructor(PlanName: PlanName) {
    super();
    this.PlanName = PlanName;
  }

  public getId(): PlanId {
    return this.id;
  }

  public getPlanName(): PlanName {
    return this.PlanName;
  }

}
