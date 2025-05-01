import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DriverProfile } from './entities/driver_profile.entity';
import { User } from 'src/auth/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { DriverRating } from './entities/driver_rating.entity';
import { BoardStat, BoardingDetails } from 'src/passengers/entities/boarding_details.entity';
import { DriverRiskLevel } from './entities/driver_risk_level.entity';
import { DriverStatus, Status } from './entities/driver_status.entity';
import { DriverStatusDto } from './dto/driver_status.dto';
import { Bus, State } from './entities/bus.entity';
import { IssueReportDto } from './dto/issue_report.dto';
import { Record, ReportBy } from 'src/coop/entities/record.entity';
import { Violation } from 'src/coop/entities/violation.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateDriverProfileDto } from './dto/driver_profile.dto';
import { FeedbackDto } from './dto/feedback.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverProfile)
    private driverRepository: Repository<DriverProfile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(BoardingDetails)
    private boardingRepository: Repository<BoardingDetails>,

    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,

    @InjectRepository(DriverRating)
    private driverRatingRepository : Repository<DriverRating>,

    @InjectRepository(DriverRiskLevel)
    private driverRiskRepository : Repository<DriverRiskLevel>,

    @InjectRepository(DriverStatus)
    private driverStatusRepository : Repository<DriverStatus>,

    @InjectRepository(Bus)
    private busRepository : Repository<Bus>,

    @InjectRepository(Record)
    private recordRepository : Repository<Record>,

    @InjectRepository(Violation)
    private violationRepository : Repository<Violation>
  ) {}

  //Driver Profile
  async createDriverProfile(
    driver_id: number,
    coop_id: number,
    first_name: string,
    last_name: string,
    address: string,
    age: number,
    cell_num: string,
    license_no: string,
    plate_number: string,
    route_one: string,
    route_two: string,
    middle_name?: string,
    driver_img?: string
  ) {
    const driver = await this.userRepository.findOne({
      where: { id: driver_id, role: "driver" as any },
    });
    if (!driver) {
      throw new NotFoundException("Driver not found");
    }

    const coop = await this.userRepository.findOne({
      where: { id: coop_id, role: "coop" as any },
    });
    if (!coop) {
      throw new NotFoundException("Coop not found");
    }
    const driverProfile = this.driverRepository.create({
      driver,
      coop,
      first_name,
      middle_name,
      last_name,
      address,
      age,
      cell_num,
      license_no,
      plate_number,
      route_one,
      route_two,
      driver_img,
    });

    const savedDriverProfile = await this.driverRepository.save(driverProfile);

    const driverRating = this.driverRatingRepository.create({
      driver_profile: savedDriverProfile,
      rating: null,
    });
    await this.driverRatingRepository.save(driverRating);

    const driverRisk = this.driverRiskRepository.create({
      driver_profile: savedDriverProfile,
      risk_level: 'none',
    });
    await this.driverRiskRepository.save(driverRisk);

    const driverStatus = this.driverStatusRepository.create({
      driver_profile: savedDriverProfile,
      status: Status.OFF_DUTY,
    });
    await this.driverStatusRepository.save(driverStatus);

    return savedDriverProfile;
  }
  async editDriverProfile(id: number, updateProfile: UpdateDriverProfileDto) {
    const driverProfile = await this.driverRepository.findOne({
      where: { id },
      relations: ['bus'],
    });
    if (!driverProfile) {
      throw new NotFoundException("Driver profile not found");
    }
    const bus = driverProfile.bus;
    if (!bus) {
      throw new NotFoundException("Bus not found");
    }
    if (updateProfile.capacity !== undefined) {
      bus.capacity = updateProfile.capacity;
      await this.busRepository.save(bus);
    }
    
    Object.assign(driverProfile, updateProfile);
    const savedDriver = await this.driverRepository.save(driverProfile);

    return {
      savedDriver,
      savedBus: bus,
    };
  }
  async getDriverProfile(id: number) {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ["bus"],
    });
    if (!driver) {
      throw new NotFoundException("Driver profile not found");
    }
    return driver;
  }

  //Feedback
  async createFeedback(passenger_id: number, feedbackDto: FeedbackDto) {
    const {rating, message } = feedbackDto;

    const activeBoarding = await this.boardingRepository.findOne({
      where: { 
        request: {
          passenger: {
            id: passenger_id
          }
      },
      board_stat: BoardStat.ACTIVE
      },
      relations: ["driver"],
    });
    if (!activeBoarding) {
      throw new NotFoundException("Boarding details not found");
    }

    const existingFeedback = await this.feedbackRepository.findOne({
      where: {
        boarding: {
          id: activeBoarding.id,
        },
      },
    });
  
    if (existingFeedback) {
      throw new BadRequestException("Feedback for this boarding already exists");
    }

    const feedback = this.feedbackRepository.create({
      boarding: activeBoarding,
      rating,
      message,
    });
    await this.feedbackRepository.save(feedback);

    if(!activeBoarding.driver){
      throw new NotFoundException("Driver not found for this boarding");
    }

    const ratings = await this.feedbackRepository.find({
      where: {
        boarding: {
          driver: {
            id: activeBoarding.driver.id
          }
        }
      },
      select: ["rating"],
    });
    const totalRating = ratings.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    const driverRating = await this.driverRatingRepository.findOne({
      where: {
        driver_profile: activeBoarding.driver,
      }
  });

  if (driverRating) {
    driverRating.rating = averageRating;
    await this.driverRatingRepository.save(driverRating);
  } else {
    throw new NotFoundException("Driver rating not found");
  }

  return feedback;
  }
  async editFeedback(id: number, feedbackDto: FeedbackDto) {
    const feedback = await this.feedbackRepository.findOne({ 
      where: { id },
      relations: ['boarding', 'boarding.driver'],
    });
    if (!feedback) {
      throw new NotFoundException("Feedback not found");
    }

    Object.assign(feedback, feedbackDto);
    const updatedFeedback = await this.feedbackRepository.save(feedback);

    const boarding = feedback.boarding;
    const ratings = await this.feedbackRepository.find({
      where: {
        boarding: {
          driver: {
            id: boarding.driver.id
          }
        }
      },
      select: ["rating"],
    });
    const totalRating = ratings.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    const driverRating = await this.driverRatingRepository.findOne({
      where: { 
        driver_profile: {
          id: boarding.driver.id
        }
      },
    });

    if (driverRating) {
      driverRating.rating = averageRating;
      await this.driverRatingRepository.save(driverRating);
    } else {
      throw new NotFoundException("Driver rating not found");
    }
  return updatedFeedback;
  }
  async UserDeleteFeedback(id: number) {
    const soft_delete = await this.feedbackRepository.findOne({
      where: {
        id
      }
    });
    if (!soft_delete) {
      throw new NotFoundException(`Feedback not found`);
    }
    soft_delete.user_deletedAt = new Date();
    await this.feedbackRepository.save(soft_delete);
  }
  async CoopDeleteFeedback(id: number) {
    const soft_delete = await this.feedbackRepository.findOne({
      where: {
        id
      }
    });
    if (!soft_delete) {
      throw new NotFoundException(`Feedback not found`);
    }
    soft_delete.coop_deletedAt = new Date();
    await this.feedbackRepository.save(soft_delete);
  }
  async getUserFeedback(passenger_id: number) {
    const feedbacks = await this.feedbackRepository.find({
      where: {
        boarding: {
          request: {
            passenger: { id: passenger_id },
          },
        },
        user_deletedAt: IsNull(),
      },
      relations: ["boarding", "boarding.driver", "boarding.request.passenger", "boarding.driver.driver_rating"],
    });
    if (!feedbacks.length) {
      throw new NotFoundException("No feedbacks found for this user");
    }
    return feedbacks;
  }
  async getFeedbacks(coop_id: number) {
    const feedbacks = await this.feedbackRepository.find({
      where: {
        boarding: {
          driver: {
            coop: { id: coop_id },
          },
        },
        coop_deletedAt: IsNull(),
      },
      relations: ["boarding.driver", "boarding.request.passenger"],
    });

    if (!feedbacks.length) {
      throw new NotFoundException("No List of Feedbacks");
    }
    return feedbacks;
  }

  //Driver Status
  async editDriverStatus(id: number, updateStatus: DriverStatusDto) {
    const driverStatus = await this.driverStatusRepository.findOne({
      where: { id },
    });
    if (!driverStatus) {
      throw new NotFoundException('Driver status not found');
    }
  
    Object.assign(driverStatus, updateStatus);
    const updatedDriverStatus = await this.driverStatusRepository.save(driverStatus);
  
    const bus = await this.busRepository.findOne({
      where: {
        driver_profile: {
          driver_status: {
            id: id
          }
        },
      },
    });
    if (!bus) {
      throw new NotFoundException('Bus for driver not found');
    }
  
    bus.state = updateStatus.status === 'in_transit' ? State.BLUE : State.OFF;
    await this.busRepository.save(bus);
  
    return updatedDriverStatus;
  } 
  async getDriverStatus(coop_id: number, filter: string) {
    if (filter === 'in_transit') {
      const transitDrivers = await this.driverStatusRepository.find({
        where: { 
          driver_profile: {
            coop: {
              id: coop_id
            }
          },
          status: Status.IN_TRANSIT,
        },
        relations: ["driver_profile"],
      });
      if (transitDrivers.length === 0) {
        throw new NotFoundException("No in transit driver");
      }
      return transitDrivers;
  
    } else if (filter === 'off_duty') {
      const offDrivers = await this.driverStatusRepository.find({
          where: { 
            driver_profile: {
              coop: {
                id: coop_id
              }
            },
            status: Status.OFF_DUTY,
          },
          relations: ["driver_profile"],
        });
        if (offDrivers.length === 0) {
          throw new NotFoundException("No off duty driver");
        }
        return offDrivers;
    } else {
      const allDrivers = await this.driverStatusRepository.find({
        where: { 
          driver_profile: {
            coop: {
              id: coop_id
            }
          },
        },
        relations: ["driver_profile"],
      });
      if (allDrivers.length === 0) {
        throw new NotFoundException("No driver");
      }
      return allDrivers;
    }
  } 

  //Bus
  async issueReport(driver_id: number, updateBus: IssueReportDto) {
    const bus_status = await this.busRepository.findOne({ 
      where: {
        driver_profile: {
          driver: {
            id: driver_id
          }
        }
      }    
     });
    if (!bus_status) {
      throw new NotFoundException("Bus not found");
    }
    bus_status.state = State.RED;
    Object.assign(bus_status, updateBus);
    return await this.busRepository.save(bus_status);
  }
  async issueFix(driver_id: number) {
    const bus_status = await this.busRepository.findOne({ 
      where: {
        driver_profile: {
          driver: {
            id: driver_id
          },
          driver_status: {
            status: Status.IN_TRANSIT
          }
        }
      }    
     });
    if (!bus_status) {
      throw new NotFoundException("Bus not found");
    }
    bus_status.state = State.BLUE;
    bus_status.issue_desc = ' ';
    Object.assign(bus_status);
    return await this.busRepository.save(bus_status);
  }
  /*@Cron(CronExpression.EVERY_10_MINUTES)
  async fullCapacityReport() {
    const buses = await this.busRepository.find({
      where: [
        { state: State.BLUE },
        { state: State.ORANGE }
      ],
      relations: ['driver_profile', 'driver_profile.boarding'],
    });

    for (const bus of buses) {
      if (bus.driver_profile && bus.driver_profile.boarding) {
        const activeBoardings = bus.driver_profile.boarding.filter(
          boarding => boarding.board_stat === BoardStat.ACTIVE
        );

        const totalBoarding = activeBoardings.length;

        if (totalBoarding > bus.capacity && bus.state === State.BLUE) {
          bus.state = State.ORANGE;
          await this.busRepository.save(bus);

          const driver = bus.driver_profile;
          const capacityViolation = await this.violationRepository.findOne({
            where: { id: 1 },
          });

          if (!capacityViolation) {
            throw new NotFoundException("Violation not found");
          }

          await this.recordRepository.save({
            driver,
            report_by: ReportBy.SYSTEM,
            violation: capacityViolation,
            created_at: new Date(),
          });
        }
        if (totalBoarding <= bus.capacity && bus.state === State.ORANGE) {
          bus.state = State.BLUE;
          await this.busRepository.save(bus);
        }
      }
    }
  }*/
}