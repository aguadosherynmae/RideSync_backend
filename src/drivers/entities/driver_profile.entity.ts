import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { BoardingDetails } from 'src/passengers/entities/boarding_details.entity';
import { DriverRating } from './driver_rating.entity';
import { PassengerViolation } from 'src/passengers/entities/passenger_violation.entity';
import { Record } from 'src/coop/entities/record.entity';
import { DriverRiskLevel } from './driver_risk_level.entity';
  
@Entity()
export class DriverProfile  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column({nullable:true})
  middle_name?: string;

  @Column()
  last_name: string;

  @Column()
  address: string;

  @Column()
  age: number;

  @Column()
  cell_num: string;

  @Column()
  license_no: string;

  @Column()
  plate_number: string;

  @Column()
  route_one: string;

  @Column()
  route_two: string;

  @Column({ nullable: true })
  driver_img?: string;

  //Relationship
  @OneToOne(() => User, (driver) => driver.driver_profile , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'driver_id' })
  driver: User;
  @ManyToOne(() => User, (coop) => coop.drivers , { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'coop_id' })
  coop: User;
  @OneToMany(() => BoardingDetails, (boarding) => boarding.driver, { cascade: true })
  boarding: BoardingDetails[];
  @OneToOne(() => DriverRating, (driver_rating) => driver_rating.driver_profile,  { cascade: true})
  driver_rating: DriverRating;
  @OneToMany(() => PassengerViolation, (passenger_violation) => passenger_violation.driver, { cascade: true })
  passenger_violation: PassengerViolation[];
  @OneToMany(() => Record, (record) => record.driver, { cascade: true })
  record: Record[];
  @OneToOne(() => DriverRiskLevel, (driver_risk) => driver_risk.driver_profile,  { cascade: true})
  driver_risk: DriverRiskLevel;
}