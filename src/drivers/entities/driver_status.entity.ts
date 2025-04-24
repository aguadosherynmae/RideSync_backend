import { DriverProfile } from './driver_profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

export enum Status {
    OFF_DUTY = 'off_duty',
    IN_TRANSIT = 'in_transit',
  }

@Entity()
export class DriverStatus  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum:  Status, default: Status.OFF_DUTY})
  status: Status;

  //Relationship
  @OneToOne(() => DriverProfile, (driver_profile) => driver_profile.driver_status , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_Id' })
  driver_profile: DriverProfile;
}