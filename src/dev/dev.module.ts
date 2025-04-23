import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';

@Module({
  providers: [DevService],
  controllers: [DevController]
})
export class DevModule {}
