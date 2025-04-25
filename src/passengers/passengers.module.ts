import { Module } from '@nestjs/common';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { User } from 'src/auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestRide } from './entities/request_ride.entity';
import { BoardingDetails } from './entities/boarding_details.entity';
import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';
import { PassengerProfile } from './entities/passenger_profile.entity';
import { PassengerViolation } from './entities/passenger_violation.entity';
import { Card } from './entities/card.entity';
import { CashlessPayment } from './entities/cashless_payment.entity';
import { Discount } from './entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RequestRide, BoardingDetails, DriverProfile, PassengerProfile, PassengerViolation, Card, CashlessPayment, Discount])],
  controllers: [PassengersController],
  providers: [PassengersService]
})
export class PassengersModule {}
  