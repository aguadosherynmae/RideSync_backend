import { Location } from 'src/dev/entities/location.entity';
import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SubscriptionStat, User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { DriversService } from 'src/drivers/drivers.service';
import { EmailDto } from './dto/update_email.dto';
import { UsernameDto } from './dto/update_username.dto';
import { PasswordDto } from './dto/update_pass.dto';
import { Risk, RiskLevel } from 'src/coop/entities/risk.entity';
import { Bus, State } from 'src/drivers/entities/bus.entity';
import { Subscription } from 'src/dev/entities/subscription.entity';
import { SubscriptionType } from 'src/dev/entities/subscription.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private driversService: DriversService,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) throw new BadRequestException("Email already registered");

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    if (savedUser.role === UserRole.DRIVER) {
      await this.driversService.createDriverProfile(
        savedUser.id,
        dto.coop_id,
        dto.first_name,
        dto.last_name,
        dto.address,
        dto.age,
        dto.cell_num,
        dto.license_no,
        dto.plate_number,
        dto.route_one,
        dto.route_two,
        dto.middle_name,
        dto.driver_img
      );

    
      const userWithProfile = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['driver_profile'], 
      });
    
      const savedDriver = userWithProfile?.driver_profile;
      if (!savedDriver) {
        throw new Error('Driver profile not found after creation');
      }
    
      const bus = this.busRepository.create({
        driver_profile: savedDriver,
        capacity: dto.capacity,
        state: State.OFF,
      });
    
      await this.busRepository.save(bus);
  }

  if (savedUser.role === UserRole.COOP) {
    const date = new Date();
    const expiredDate = new Date(date);
    expiredDate.setMonth(date.getMonth() + dto.duration);
    const subscription = this.subscriptionRepository.create({
      coop: savedUser,
      type: SubscriptionType.COOP,
      duration: dto.duration,
      amount: dto.amount,
      created_at: date,
      expired_at: expiredDate.toISOString()
    });

    await this.subscriptionRepository.save(subscription); 

    savedUser.subscription_status = SubscriptionStat.SUBSCRIBED;
    await this.userRepository.save(savedUser);
  }
  
  if (savedUser.role === UserRole.DRIVER || savedUser.role === UserRole.PASSENGER) {
      const location = this.locationRepository.create({
      users: savedUser,
      longtitude: null,
      latitude: null,
    });
    await this.locationRepository.save(location);
  }

  if (savedUser.role === UserRole.COOP) {
    const risks = [
      this.riskRepository.create({
        coop: savedUser,
        risk_level: RiskLevel.HIGH,
        value: 50,
      }),
      this.riskRepository.create({
        coop: savedUser,
        risk_level: RiskLevel.MEDIUM,
        value: 30,
      }),
      this.riskRepository.create({
        coop: savedUser,
        risk_level: RiskLevel.LOW,
        value: 10,
      }),
    ];
  
    await this.riskRepository.save(risks);
  }  

    return savedUser;
  }
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    if (user.role === UserRole.COOP && user.subscription_status === SubscriptionStat.EXPIRED) {
      throw new UnauthorizedException("Login not allowed: Subscription expired");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

    const payload = { id: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async updateUser(user_id:number, usernameDto: UsernameDto) {
    const user = await this.userRepository.findOne({ 
        where: { id: user_id,
        role: In([UserRole.COOP, UserRole.DEV, UserRole.PASSENGER]),
      },
     });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.username = usernameDto.username;
    return await this.userRepository.save(user);
  }
  async updateEmail(user_id:number, emailDto: EmailDto) {
    const user = await this.userRepository.findOne({ 
        where: { id: user_id },
     });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.email = emailDto.email;
    return await this.userRepository.save(user);
  }
  async updatePassword(user_id: number, passwordDto: PasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(passwordDto.current_password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(passwordDto.password, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
  }
}