import { Fare } from 'src/coop/entities/fare.entity';
import { Risk } from 'src/coop/entities/risk.entity';
import { Violation } from 'src/coop/entities/violation.entity';
import { Location } from 'src/dev/entities/location.entity';
import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';
import { Card } from 'src/passengers/entities/card.entity';
import { PassengerProfile } from 'src/passengers/entities/passenger_profile.entity';
import { PassengerViolation } from 'src/passengers/entities/passenger_violation.entity';
import { RequestRide } from 'src/passengers/entities/request_ride.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  COOP = 'coop',
  DEV = 'developer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Passenger-specific, Coop-specific, Dev-specific
  @Column({ nullable: true })
  username?: string;

  // Relationships 
  @OneToOne(() => DriverProfile, (driver_profile) => driver_profile.driver,  { cascade: true})
  driver_profile: DriverProfile;
  @OneToMany(() => DriverProfile, (drivers) => drivers.coop,  { cascade: true})
  drivers: DriverProfile[]; 
  @OneToOne(() => Location, (location) => location.users,  { cascade: true})
  location: Location;
  @OneToMany(() => RequestRide, (request) => request.passenger,  { cascade: true})
  request: RequestRide[]; 
  @OneToOne(() => PassengerProfile, (passenger_profile) => passenger_profile.user,  { cascade: true})
  passenger_profile: PassengerProfile;
  @OneToMany(() => PassengerViolation, (passenger_violation) => passenger_violation.passenger, { cascade: true })
  passenger_violation: PassengerViolation[];
  @OneToMany(() => Violation, (violation) => violation.coop, { cascade: true })
  violation: Violation[];
  @OneToMany(() => Risk, (risk) => risk.coop, { cascade: true })
  risk: Risk[];
  @OneToMany(() => Fare, (fare) => fare.coop, { cascade: true })
  fare: Fare[];
  @OneToOne(() => Card, (card) => card.user,  { cascade: true})
  card: Card;
}