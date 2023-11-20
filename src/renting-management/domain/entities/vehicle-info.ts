import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicle_info')
export class VehicleInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  temperatura: number;

  @Column({ type: 'float' })
  humedad: number;
}
