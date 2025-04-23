import { DriverProfile } from './driver_profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class DriverRating  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: true })
  rating?: number | null;

  //Relationship
  @OneToOne(() => DriverProfile, (driver_profile) => driver_profile.driver_rating , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_Id' })
  driver_profile: DriverProfile;
}