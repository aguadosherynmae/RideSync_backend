import { User } from 'src/auth/entities/user.entity';
import { CashlessPayment } from 'src/passengers/entities/cashless_payment.entity';
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Fare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from_loc: string;  

  @Column('decimal')
  from_lat: number;

  @Column('decimal')
  from_long: number;

  @Column()
  to_loc: string;  

  @Column('decimal')
  to_lat: number;

  @Column('decimal')
  to_long: number;

  @Column()
  amount: number;

  @DeleteDateColumn()
  deletedAt?: Date;
  
  //Relationships
  @OneToMany(() => CashlessPayment, (cashless) => cashless.fare,  { cascade: true})
  cashless: CashlessPayment[];
  @ManyToOne(() => User, (coop) => coop.fare, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'coop_id' })
  coop: User;
}