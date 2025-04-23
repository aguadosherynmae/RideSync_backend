import { User } from 'src/auth/entities/user.entity';
import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, DeleteDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class PassengerViolation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  violation: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @DeleteDateColumn({nullable: true})
  user_deletedAt?: Date | null;;

  @DeleteDateColumn({nullable: true})
  dev_deletedAt?: Date | null;;

  //Relationship
  @ManyToOne(() => User, (passenger) => passenger.passenger_violation, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;
  @ManyToOne(() => DriverProfile, (driver) => driver.passenger_violation, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;
}