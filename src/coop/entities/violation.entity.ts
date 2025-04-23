import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Reports } from './report.entity';
import { Record } from './record.entity';

export enum Severity {
  THREE = 3,
  TWO = 2,
  ONE = 1
}

@Entity()
export class Violation  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Severity })
  severity: Severity;

  @Column({ default: false }) 
  isDefault: boolean;

  @DeleteDateColumn()
  deletedAt?: Date;

  //Relationship
  @ManyToOne(() => User, (coop) => coop.violation, { onDelete: 'CASCADE', nullable: true }) 
  @JoinColumn({ name: 'coop_id' })
  coop: User;
  @OneToMany(() => Reports, (reports) => reports.violation, { cascade: true })
  reports: Reports[];
  @OneToMany(() => Record, (record) => record.violation, { cascade: true })
  record: Record[];
}