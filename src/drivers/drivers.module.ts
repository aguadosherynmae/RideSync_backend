import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { DriverProfile } from './entities/driver_profile.entity';
import { Feedback } from './entities/feedback.entity';
import { DriverRating } from './entities/driver_rating.entity';
import { BoardingDetails } from 'src/passengers/entities/boarding_details.entity';
import { DriverRiskLevel } from './entities/driver_risk_level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DriverProfile, Feedback, DriverRating, BoardingDetails, DriverRiskLevel])],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService]
})
export class DriversModule {}
