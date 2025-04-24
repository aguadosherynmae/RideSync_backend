import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Help } from './entities/help.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Help])],
  providers: [DevService],
  controllers: [DevController]
})
export class DevModule {}
