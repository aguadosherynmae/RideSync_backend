import { User } from 'src/auth/entities/user.entity';
import { CashlessPayment } from 'src/passengers/entities/cashless_payment.entity';
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Fare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  route_from: string;  

  @Column()
  route_to: string;  

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