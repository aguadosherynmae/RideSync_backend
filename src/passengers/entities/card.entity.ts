import { Entity, PrimaryGeneratedColumn, Column, OneToOne, DeleteDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm';
import { CashlessPayment } from './cashless_payment.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Card  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  full_name: string;

  @Column()
  four_digits: number;

  @Column()
  card_brand: string;

  @Column({ default: true }) 
  isActive: boolean;

  @Column({ type: 'timestamp' })
  expire_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  //Relationships
  @OneToMany(() => CashlessPayment, (cashless) => cashless.card,  { cascade: true})
  cashless: CashlessPayment[];
  @ManyToOne(() => User, (user) => user.card , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' })
  user: User;
}