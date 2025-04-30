import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversModule } from 'src/drivers/drivers.module';
import { Location } from 'src/dev/entities/location.entity';
import { Risk } from 'src/coop/entities/risk.entity';
import { Bus } from 'src/drivers/entities/bus.entity';
import { Subscription } from 'src/dev/entities/subscription.entity';
import { Fare } from 'src/coop/entities/fare.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Location, Risk, Bus, Subscription, Fare]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret', 
      signOptions: { expiresIn: '1h' },
    }),
    DriversModule,
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
