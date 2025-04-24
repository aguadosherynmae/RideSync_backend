import { Module } from '@nestjs/common';
import { CoopController } from './coop.controller';
import { CoopService } from './coop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Violation } from './entities/violation.entity';
import { User } from 'src/auth/entities/user.entity';
import { Reports } from './entities/report.entity';
import { Record } from './entities/record.entity';
import { BoardingDetails } from 'src/passengers/entities/boarding_details.entity';
import { Risk } from './entities/risk.entity';
import { DriverRiskLevel } from 'src/drivers/entities/driver_risk_level.entity';
import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Violation, User, Reports, Record, BoardingDetails, Risk, DriverRiskLevel, DriverProfile])],
  controllers: [CoopController],
  providers: [CoopService]
})
export class CoopModule {}
