import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import { Record } from 'src/coop/entities/record.entity';
import { CashlessPayment } from './cashless_payment.entity';

export enum DiscountStatus {
  APPLIED = 'applied',
  NOT_APP = 'not_applied',
  USED = 'used'
}

@Entity()
export class Discount  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  expire_date: Date;

  @Column()
  discount_amount: number;

  @Column({ type: 'enum', enum:  DiscountStatus, default: DiscountStatus.NOT_APP})
  discount_status: DiscountStatus;

  //Relationship
  @OneToOne(() => Record, (record) => record.discount, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'record_id' })
  record?: Record;
  @OneToOne(() => CashlessPayment, (cashless) => cashless.discount,  { cascade: true})
  cashless: CashlessPayment;
}