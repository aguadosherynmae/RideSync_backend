import { BoardingDetails } from 'src/passengers/entities/boarding_details.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';
  
@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  message: string;  

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @DeleteDateColumn({nullable: true})
  user_deletedAt?: Date | null;;

  @DeleteDateColumn({nullable: true})
  coop_deletedAt?: Date | null;

  //Relationship
  @OneToOne(() => BoardingDetails, (boarding) => boarding.feedback, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'boarding_id' })
  boarding: BoardingDetails;
}