import { DriverProfile } from './driver_profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

export enum State {
    BLUE = 'blue',
    RED = 'red',
    ORANGE = 'orange',
    OFF = 'off'
  }

@Entity()
export class Bus  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum:  State, default: State.OFF})
  state: State;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  issue_desc?: string;

  //Relationship
  @OneToOne(() => DriverProfile, (driver_profile) => driver_profile.bus , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_id' })
  driver_profile: DriverProfile;
}