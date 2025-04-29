import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { BoardingDetails } from './boarding_details.entity';

export enum RequestState {
  WAITING = 'waiting',
  NOT = 'not'
}

@Entity()
export class RequestRide  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dest_loc: string;

  @Column('decimal')
  dest_lat: number;

  @Column('decimal')
  dest_long: number;


  @Column({ type: 'enum', enum: RequestState, default: RequestState.WAITING})
  state: RequestState;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  //Relationship
  @ManyToOne(() => User, (passenger) => passenger.request, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;
  @OneToOne(() => BoardingDetails, (boarding) => boarding.request,  { cascade: true})
  boarding: BoardingDetails;
}