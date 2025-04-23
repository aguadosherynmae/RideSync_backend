import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DriversModule } from './drivers/drivers.module';
import { DevModule } from './dev/dev.module';
import { PassengersModule } from './passengers/passengers.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CoopModule } from './coop/coop.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'ridesync_db',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    AuthModule,
    DriversModule,
    DevModule,
    PassengersModule,
    CoopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}