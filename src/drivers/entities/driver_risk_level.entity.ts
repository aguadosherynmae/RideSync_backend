import { DriverProfile } from './driver_profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class DriverRiskLevel  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  risk_level: string;

  //Relationship
  @OneToOne(() => DriverProfile, (driver_profile) => driver_profile.driver_risk , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_Id' })
  driver_profile: DriverProfile;
}