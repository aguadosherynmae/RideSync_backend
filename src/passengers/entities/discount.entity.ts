import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import { Record } from 'src/coop/entities/record.entity';
import { CashlessPayment } from './cashless_payment.entity';
import { Reports } from 'src/coop/entities/report.entity';

export enum DiscountType {
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

  @Column({ type: 'decimal' })
  discount_amount: number;  

  @Column({ type: 'enum', enum:  DiscountType, default: DiscountType.NOT_APP})
  discount_type: DiscountType;

  //Relationship
  @OneToOne(() => Reports, (report) => report.discount, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'report_id' })
  report?: Reports;
  @OneToOne(() => CashlessPayment, (cashless) => cashless.discount,  { cascade: true})
  cashless: CashlessPayment;
}