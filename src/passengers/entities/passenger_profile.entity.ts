import { IsDateString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

export enum DiscountType {
  STUDENT = 'student',
  SENIOR = 'senior',
  PWD = 'pwd'
}

export enum DiscountStatus {
  VERIFIED = 'verified',
  NOT_VERIFIED = 'notverified',
  PENDING = 'pending',
  DECLINED = 'declined',
  REVERIFY = 'reverify'
}

@Entity()
export class PassengerProfile  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column({nullable: true})
  middle_name?: string;

  @Column()
  last_name: string;

  @Column()
  age: number;

  @Column()
  @IsDateString()
  birth_date: string;

  @Column({ nullable: true })
  passenger_img?: string;

  @Column({ type: 'enum', enum:  DiscountType, nullable: true})
  discount_type?: DiscountType | null;

  @Column({ type: 'text', nullable: true })
  proof_img?: string | null;

  @Column({ type: 'enum', enum:  DiscountStatus, default: DiscountStatus.NOT_VERIFIED})
  discount_status: DiscountStatus;
  
  //Relationship
  @OneToOne(() => User, (user) => user.passenger_profile , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' })
  user: User;
}