import { Cron } from '@nestjs/schedule';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { RequestRide, RequestState } from './entities/request_ride.entity';
import { BoardStat, BoardingDetails } from './entities/boarding_details.entity';
import { RequesDto } from './dto/request_ride.dto';
import { BoardingDto } from './dto/boarding_details';
import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';
import { PassengerProfileDto } from './dto/passenger_profile.dto';
import { DiscountStatus, PassengerProfile } from './entities/passenger_profile.entity';
import { UpdateProfileDto } from './dto/update_profile.dto';
import { PassengerViolationDto } from './dto/passenger_violation.dto';
import { PassengerViolation } from './entities/passenger_violation.entity';
import { UpdatePassengerViolationDto } from './dto/update_passenger_violation.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(RequestRide)
    private requestRepository: Repository<RequestRide>,

    @InjectRepository(BoardingDetails)
    private boardingRepository: Repository<BoardingDetails>,

    @InjectRepository(DriverProfile)
    private driverRepository: Repository<DriverProfile>,

    @InjectRepository(PassengerProfile)
    private passengerRepository: Repository<PassengerProfile>,

    @InjectRepository(PassengerViolation)
    private passengerViolationRepository: Repository<PassengerViolation>,
  ) {}

  //Request Ride
  async createRequest(passenger_id: number, request: RequesDto) {
    const { destination } = request;
  
    const activePassenger = await this.userRepository.findOne({
      where: { id: passenger_id },
    });
  
    if (!activePassenger) {
      throw new NotFoundException("Passenger not found");
    }
  
    const activeBoarding = await this.boardingRepository.findOne({
      where: {
        request: {
          passenger: { id: passenger_id },
          state: RequestState.NOT,
        },
        board_stat: BoardStat.ACTIVE,
      },
    });
  
    if (activeBoarding) {
      return {
        message: "You’re currently riding a bus. No need to request another ride.",
      };
    }
  
    const lastRequest = await this.requestRepository.findOne({
      where: {
        passenger: { id: passenger_id },
        state: RequestState.WAITING,
      },
      order: { created_at: 'DESC' },
    });
  
    if (lastRequest) {
      const currentTime = new Date();
      const requestCreatedAt = lastRequest.created_at;
      const timeDifferenceInMinutes =
        (currentTime.getTime() - requestCreatedAt.getTime()) / 60000;
  
      if (timeDifferenceInMinutes < 5) {
        return {
          message: 'Please wait 5 minutes before requesting another ride.',
        };
      }
    }
  
    const request_ride = this.requestRepository.create({
      passenger: activePassenger,
      destination,
      state: RequestState.WAITING,
    });
  
    return await this.requestRepository.save(request_ride);
  }
  async editRequest(passenger_id: number, requestDto: RequesDto) {
    const editReq = await this.requestRepository.findOne({ 
        where: { 
            passenger: {
              id: passenger_id
            },
            state: RequestState.WAITING
        },
     });
    if (!editReq) {
      throw new NotFoundException("Request not found");
    }

    Object.assign(editReq, requestDto);
    return await this.requestRepository.save(editReq);
  }
  /*@Cron(CronExpression.EVERY_MINUTE) 
  async handleAutoUpdate() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000); 

    const activeRequest = await this.requestRepository.find({
      where: {
        created_at: LessThan(fiveMinutesAgo),
        state: RequestState.WAITING,
      },
    });

    for (const request of activeRequest) {
      request.state = RequestState.NOT; 
      await this.requestRepository.save(request);
    }
  }*/
  async getUserRequest(passenger_id: number) {
    const requests = await this.requestRepository.find({
      where: { 
        passenger: { id: passenger_id },
        state: RequestState.NOT
      },
      order: { created_at: "DESC" },
      take: 5,
    });

    if (!requests.length) {
      throw new NotFoundException("No Past Requests");
    }

    return requests.map((req) => req.destination);
  }

  //Boarding Details
  async createPassengerBoarding(passenger_id: number, boarding: BoardingDto) {
    const { driver_id } = boarding;

    const existingActiveBoard = await this.boardingRepository.findOne({
      where: {
        request: {
          passenger: {
            id: passenger_id
          }
        },
        board_stat: BoardStat.ACTIVE, 
      },
    });
  
    if (existingActiveBoard) {
      throw new BadRequestException('Passenger already has an active boarding');
    }

    const activeRequest = await this.requestRepository.findOne({
      where: { 
        passenger:{
          id: passenger_id
        },
        state: RequestState.WAITING },
    });
    if (!activeRequest) {
      throw new NotFoundException("No active WAITING request found");
    }

    const driver = await this.driverRepository.findOne({
      where: { id: driver_id },
    });
    if (!driver) {
      throw new NotFoundException("Driver not found");
    }

    const board = this.boardingRepository.create({
      request: activeRequest ,
      driver,
      board_stat: BoardStat.ACTIVE,
    });

    await this.boardingRepository.save(board);

    activeRequest.state = RequestState.NOT;
    await this.requestRepository.save(activeRequest);

    return board;
  }
  async createDriverBoarding(driver_id: number) {

    const activeDriver = await this.driverRepository.findOne({
      where: {
        id: driver_id
      }
    });
    if (!activeDriver) {
      throw new NotFoundException("Driver not found");
    }

    const board = this.boardingRepository.create({
      driver: activeDriver,
      board_stat: BoardStat.ACTIVE,
    });

    return await this.boardingRepository.save(board);
  }
  async deleteDriverBoarding() {
    const boarding = await this.boardingRepository.findOne({
      where: { request: IsNull() },
      order: { created_at: 'DESC' },
    });
  
    if (!boarding) {
      throw new NotFoundException("No boarding record found");
    }
  
    const deleteBoard = await this.boardingRepository.delete(boarding.id);
    if (!deleteBoard.affected) {
      throw new NotFoundException("Boarding not found");
    }
  }
  async getUserBoarding(passenger_id: number) {
    const boarding = await this.boardingRepository.findOne({
      where: {
        request: { passenger: { id: passenger_id } },
        board_stat: BoardStat.ACTIVE,
      },
      relations: ["request", "driver", "driver.driver_rating"],
    });

    if (!boarding) {
      throw new NotFoundException("No active boarding");
    }

    return boarding;
  }
  /* async getActiveBoarding(driver_id: number) {
    const active = await this.boardingRepository.find({
      where: {
        board_stat: BoardStat.ACTIVE,
        driver: { 
          driver: {
            id: driver_id
          }
        },
      },
      relations: ["driver", "request", "cashless", "cashless.discount"],
    });
  
    if (!active.length) {
      throw new NotFoundException("No List of Active Boarding");
    }
  
    const updatedActive = active.map(boarding => ({
      ...boarding,
      message: boarding.request ? "Cashless Payment Passenger" : "Cash Payment Passenger",
    }));
  
    return {
      total: active.length,
      data: updatedActive,
    };
  } */

  //Passenger Profile
  async createPassengerProfile(passenger_id: number, passengerProfileDto: PassengerProfileDto) {
    const {
      first_name,
      last_name,
      age,
      birth_date,
      middle_name,
      discount_type,
      proof_img,
      passenger_img,
    } = passengerProfileDto;

    const activeUser = await this.userRepository.findOne({ 
      where: { id: passenger_id } 
    });
    if (!activeUser) {
      throw new NotFoundException("Passenger not found");
    }

    const passengerProfile = this.passengerRepository.create({
      user: activeUser,
      first_name,
      last_name,
      age,
      birth_date,
      middle_name,
      discount_type,
      proof_img,
      passenger_img,
      discount_status: discount_type ? DiscountStatus.PENDING : DiscountStatus.NOT_VERIFIED
    });
    return await this.passengerRepository.save(passengerProfile);
  }
  async editPassengerProfile(id: number, updateProfileDto: PassengerProfileDto) {
    const passengerProfile = await this.passengerRepository.findOne({
      where: { id },
    });
    if (!passengerProfile) {
      throw new NotFoundException("Passenger profile not found");
    }

    Object.assign(passengerProfile, updateProfileDto);

    if ('discount_type' in updateProfileDto) {
      passengerProfile.discount_status = updateProfileDto.discount_type
        ? DiscountStatus.PENDING
        : DiscountStatus.NOT_VERIFIED;
        if (!updateProfileDto.discount_type) {
          passengerProfile.proof_img = null;
        }
    }
    return await this.passengerRepository.save(passengerProfile);
  }
  @Cron('0 0 31 12 *')
  async reverifyProfile() {
  const allPassengers = await this.passengerRepository.find({
    where: {
      discount_status: DiscountStatus.VERIFIED,
    },
  });

  for (const passenger of allPassengers) {
    passenger.discount_status = DiscountStatus.REVERIFY; 
    await this.passengerRepository.save(passenger); 
  }
  }
  async verifyProfile(id: number, verifyProfile: UpdateProfileDto) {
    const verify = await this.passengerRepository.findOne({ where: { id } });
    if (!verify) {
      throw new NotFoundException("Passenger Profile not found");
    }

    Object.assign(verify, verifyProfile);
    if ('discount_status' in verifyProfile) {
      if (verifyProfile.discount_status === 'declined') {
        verify.proof_img = null;
        verify.discount_type = null;
      }
    }
    return await this.passengerRepository.save(verify);
  }
  async getPassengerProfile(passenger_id: number) {
    const passenger = await this.passengerRepository.findOne({
      where: { user: { id: passenger_id } },
      relations: ["user"],
    });
    if (!passenger) {
      throw new NotFoundException("Passenger profile not found");
    }
    return passenger;
  }
  async getPassengers(filter: string) {
    if (filter === 'verified') {
      const verifiedPassengers = await this.passengerRepository.find({
        where: { discount_status: DiscountStatus.VERIFIED },
      });
      if (verifiedPassengers.length === 0) {
        throw new NotFoundException("No list of verified passenger discounts");
      }
      return verifiedPassengers;
  
    } else if (filter === 'pending') {
      const declinedPassengers = await this.passengerRepository.find({
        where: { discount_status: DiscountStatus.PENDING },
      });
      if (declinedPassengers.length === 0) {
        throw new NotFoundException("No list of pending passenger discounts verification");
      }
      return declinedPassengers;
  
    } else {
      const passengers = await this.passengerRepository.find({
        where: {  
          discount_status: In([DiscountStatus.VERIFIED, DiscountStatus.PENDING]),
        },
      });
      if (passengers.length === 0) {
        throw new NotFoundException("No list of passengers");
      }
      return passengers;
    }
  }
  async getTotalPassengers() {
    const total = await this.passengerRepository.count({
      where: {
        discount_status: DiscountStatus.PENDING
      }
    });
    if (!total) {
      throw new NotFoundException("No List of Pending Passenger Discount Verification");
    }
    return total;
  }

  //Passenger Violations
  async createPassengerViolation(driver_id: number, passenger_violationDto: PassengerViolationDto) {
    const { passenger_id, violation } = passenger_violationDto;

    const passenger = await this.userRepository.findOne({
      where: { id: passenger_id },
    });
    if (!passenger) {
      throw new NotFoundException("Passenger not found");
    }

    const activeDriver = await this.driverRepository.findOne({
      where: { 
        driver: {
          id: driver_id
        }
      },
    });
    if (!activeDriver) {
      throw new NotFoundException("Driver not found");
    }

    const passenger_violation = this.passengerViolationRepository.create({
      passenger,
      driver: activeDriver,
      violation,
    });

    return await this.passengerViolationRepository.save(passenger_violation);
  }
  async editPassengerViolation(id: number, updatePassV: UpdatePassengerViolationDto) {
    const passenger_violation = await this.passengerViolationRepository.findOne(
      { where: { id } }
    );
    if (!passenger_violation) {
      throw new NotFoundException("Passenger Violation not found");
    }

    Object.assign(passenger_violation, updatePassV);
    return await this.passengerViolationRepository.save(passenger_violation);
  }
  async PassDeleteFeedback(id: number) {
    const soft_delete = await this.passengerViolationRepository.findOne({
      where: {
        id
      }
    });
    if (!soft_delete) {
      throw new NotFoundException(`Feedback not found`);
    }
    soft_delete.user_deletedAt = new Date();
    await this.passengerViolationRepository.save(soft_delete);
  }
  async DevDeleteFeedback(id: number) {
    const soft_delete = await this.passengerViolationRepository.findOne({
      where: {
        id
      }
    });
    if (!soft_delete) {
      throw new NotFoundException(`Feedback not found`);
    }
    soft_delete.dev_deletedAt = new Date();
    await this.passengerViolationRepository.save(soft_delete);
  }
  async getPassengerViolations(passenger_id: number) {
    const violations = await this.passengerViolationRepository.find({
      where: {
        user_deletedAt: IsNull(),
        passenger: { id: passenger_id },
      },
      order: { created_at: "DESC" },
      relations: ["passenger", "driver"],
    });

    if (!violations.length) {
      throw new NotFoundException(`No violations found`);
    }

    return violations;
  }
  async getAllPassViolations() {
    const all = await this.passengerViolationRepository.find({
      where: {
        dev_deletedAt: IsNull()
      },
      relations: ["passenger", "driver"],
    });

    if (!all.length) {
      throw new NotFoundException(`No violations found`);
    }
    return all;
  }
}