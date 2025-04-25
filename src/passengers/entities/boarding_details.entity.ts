import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { RequestRide } from './request_ride.entity';
import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';
import { Feedback } from 'src/drivers/entities/feedback.entity';
import { Reports } from 'src/coop/entities/report.entity';
import { CashlessPayment } from './cashless_payment.entity';

export enum BoardStat {
  ACTIVE = 'active',
  NOT = 'not'
}

@Entity()
export class BoardingDetails  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  current_loc: string;

  @Column({ type: 'enum', enum: BoardStat, default: BoardStat.ACTIVE })
  board_stat: BoardStat;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  //Relationship
  @OneToOne(() => RequestRide, (request) => request.boarding, { onDelete: 'CASCADE', nullable: true }) 
  @JoinColumn({ name: 'requestride_id' })
  request?: RequestRide;
  @ManyToOne(() => DriverProfile, (driver) => driver.boarding, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;
  @OneToOne(() => Feedback, (feedback) => feedback.boarding, { cascade: true })
  feedback: Feedback;
  @OneToOne(() => Reports, (reports) => reports.boarding, { cascade: true })
  reports: Reports;
  @OneToOne(() => CashlessPayment, (cashless) => cashless.boarding,  { cascade: true})
  cashless: CashlessPayment;
}