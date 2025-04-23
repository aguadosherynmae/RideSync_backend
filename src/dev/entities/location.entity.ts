import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
  
@Entity()
export class Location  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { nullable: true })
  latitude: number | null;

  @Column('decimal', { nullable: true })
  longtitude: number | null;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  //Relationship
  @OneToOne(() => User, (users) => users.location , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' })
  users: User;
}