import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

export enum RiskLevel {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    NONE = 'none'
  }

@Entity()
export class Risk  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum:  RiskLevel})
  risk_level: RiskLevel;

  @Column()
  value: number;

  //Relationships
  @ManyToOne(() => User, (coop) => coop.risk, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'coop_id' })
  coop: User;
}