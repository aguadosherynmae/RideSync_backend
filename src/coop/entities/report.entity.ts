import { Violation } from './violation.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';
import { BoardingDetails } from 'src/passengers/entities/boarding_details.entity';

@Entity()
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @DeleteDateColumn()
  pass_deletedAt?: Date;

  @DeleteDateColumn()
  coop_deletedAt?: Date;

  //Relationship
  @OneToOne(() => BoardingDetails, (boarding) => boarding.reports, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'boarding_id' })
  boarding: BoardingDetails;
  @ManyToOne(() => Violation, (violation) => violation.reports, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'violation_id' })
  violation: Violation;
}