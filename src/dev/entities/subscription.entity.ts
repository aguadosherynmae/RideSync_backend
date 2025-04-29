import { IsDateString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, JoinColumn } from 'typeorm';

export enum SubscriptionType {
  COOP = 'coop',
  BUSINESS = 'business',
}

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SubscriptionType })
  type: SubscriptionType;

  @Column()
  duration: number;

  @Column('decimal')
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column()
  @IsDateString()
  expired_at: string;

  //Relationships
  @OneToOne(() => User, (coop) => coop.subscription , { onDelete: 'CASCADE', nullable: true }) 
  @JoinColumn({ name: 'coop_id' })
  coop?: User;
}