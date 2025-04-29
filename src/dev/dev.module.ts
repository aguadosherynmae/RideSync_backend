import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Help } from './entities/help.entity';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Help, Subscription, User])],
  providers: [DevService],
  controllers: [DevController]
})
export class DevModule {}
