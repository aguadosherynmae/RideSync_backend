import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversModule } from 'src/drivers/drivers.module';
import { Location } from 'src/dev/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Location]),
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
