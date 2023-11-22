import { Entity, BeforeInsert, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicle_info')
export class VehicleInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  temperatura: number;

  @Column({ type: 'float' })
  humedad: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @BeforeInsert()
  checkDate() {
    if (this.date && this.date.toISOString() === '0000-00-00T00:00:00.000Z') {
      this.date = null;
    }
  }
}
