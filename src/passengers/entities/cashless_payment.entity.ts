import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, DeleteDateColumn, OneToMany } from 'typeorm';
import { BoardingDetails } from './boarding_details.entity';
import { Fare } from 'src/coop/entities/fare.entity';
import { Discount } from './discount.entity';
import { Card } from './card.entity';

@Entity()
export class CashlessPayment  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount_paid: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_paid: Date;

  @Column()
  ref_num: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  //Relationship
  @OneToOne(() => BoardingDetails, (boarding) => boarding.cashless, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'boarding_id' })
  boarding:BoardingDetails;
  @ManyToOne(() => Fare, (fare) => fare.cashless, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'fare_id' })
  fare: Fare;
  @OneToOne(() => Discount, (discount) => discount.cashless, { onDelete: 'CASCADE', nullable: true }) 
  @JoinColumn({ name: 'discount_id' })
  discount?: Discount;
  @ManyToOne(() => Card, (card) => card.cashless, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'card_id' })
  card:Card;
}