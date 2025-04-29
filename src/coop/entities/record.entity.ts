import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';
import { Violation } from './violation.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';

export enum ReportBy {
  SYSTEM = 'system',
  PASSENGERS = 'passengers',
  COOP = 'coop'
}

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum:  ReportBy, default: ReportBy.PASSENGERS})
  report_by: ReportBy;  

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  //Relationship
  @ManyToOne(() => DriverProfile, (driver) => driver.record, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;
  @ManyToOne(() => Violation, (violation) => violation.record, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'violation_id' })
  violation: Violation;
}