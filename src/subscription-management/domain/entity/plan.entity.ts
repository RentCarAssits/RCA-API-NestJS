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
 
  @ApiProperty()
  @Column(() => Benefits, { prefix: false })
  private readonly Benefits: string;

  public constructor(PlanName: PlanName, benefits:string) {
    super();
    this.PlanName = PlanName;
    this.Benefits=benefits;
  }

  public getId(): PlanId {
    return this.id;
  }

  public getPlanName(): PlanName {
    return this.PlanName;
  }
  public getBenefits(){
    return this.Benefits;
  }
  public changeId(id: PlanId) {
    this.id = id;
  }
}
