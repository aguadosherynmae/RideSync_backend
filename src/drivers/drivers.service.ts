import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DriverProfile } from './entities/driver_profile.entity';
import { User } from 'src/auth/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { DriverRating } from './entities/driver_rating.entity';
import { FeedbackDto } from './dto/boarding.dto';
import { BoardStat, BoardingDetails } from 'src/passengers/entities/boarding_details.entity';
import { DriverRiskLevel } from './entities/driver_risk_level.entity';

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
    private driverRiskRepository : Repository<DriverRiskLevel>
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

    return savedDriverProfile;
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
}