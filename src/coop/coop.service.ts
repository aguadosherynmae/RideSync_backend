import { Cron } from '@nestjs/schedule';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DeepPartial } from 'typeorm';
import { Violation } from './entities/violation.entity';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { ViolationDto } from './dto/violation.dto';
import { UpdateViolationDto } from './dto/update_violation.dto';
import { ReportDto } from './dto/report.dto';
import { BoardStat, BoardingDetails } from 'src/passengers/entities/boarding_details.entity';
import { Reports } from './entities/report.entity';
import { Record, ReportBy } from './entities/record.entity';
import { Risk, RiskLevel } from './entities/risk.entity';
import { DriverRiskLevel } from 'src/drivers/entities/driver_risk_level.entity';
import { UpdateRiskDto } from './dto/update_risk.dto';
import { DriverProfile } from 'src/drivers/entities/driver_profile.entity';
import { RecordDto } from './dto/record.dto';
import { Fare } from './entities/fare.entity';
import { FareDto } from './dto/fare.dto';
import { DriverStatus, Status } from 'src/drivers/entities/driver_status.entity';
import { Discount, DiscountType } from 'src/passengers/entities/discount.entity';
import { FilterRecordDto } from './dto/filter_record.dto';

@Injectable()
export class CoopService {
  constructor(
    @InjectRepository(Violation)
    private violationRepository: Repository<Violation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(BoardingDetails)
    private boardingRepository: Repository<BoardingDetails>,

    @InjectRepository(Reports)
    private reportRepository: Repository<Reports>,

    @InjectRepository(Record)
    private recordRepository: Repository<Record>,

    @InjectRepository(Risk)
    private riskRepository: Repository<Risk>,

    @InjectRepository(DriverRiskLevel)
    private driverRiskRepository: Repository<DriverRiskLevel>,

    @InjectRepository(DriverProfile)
    private driverRepository: Repository<DriverProfile>,

    @InjectRepository(Fare)
    private fareRepository: Repository<Fare>,

    @InjectRepository(DriverStatus)
    private driverStatusRepository: Repository<DriverStatus>,

    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,

  ) {}
    
  //Violation
  async createViolation(coop_id: number, violationDto: ViolationDto) {
    const { name, severity } = violationDto;
    const activeCoop = await this.userRepository.findOne({ where: { id: coop_id } });
    if (!activeCoop) {
      throw new NotFoundException("Coop not found");
    }

    const violation = this.violationRepository.create({
      coop:activeCoop,
      name,
      severity,
      isDefault: false
    });

    return await this.violationRepository.save(violation);
  }
  async createDefaultViolation(violationDto: ViolationDto) {
    const { name, severity } = violationDto;
    const violation = this.violationRepository.create({
      name,
      severity,
      isDefault: true
    });

    return await this.violationRepository.save(violation);
  }
  async editViolation(id: number, updateViolation: UpdateViolationDto) {
    const violation = await this.violationRepository.findOne({ where: { id } });
    if (!violation) {
      throw new NotFoundException("Violation not found");
    }
    if (violation.isDefault) {
      if ('severity' in updateViolation) {
        violation.severity = updateViolation.severity;
      }
    } else {
      Object.assign(violation, updateViolation);
    }
    return await this.violationRepository.save(violation);
  }
  async editDefaultViolation(id: number, updateViolation: ViolationDto) {
    const violation = await this.violationRepository.findOne({ where: { id } });
    if (!violation) {
      throw new NotFoundException("Violation not found");
    }

    Object.assign(violation, updateViolation);
    return await this.violationRepository.save(violation);
  }
  async softDeleteViolation(id: number) {
    const violation = await this.violationRepository.findOne({
      where: { id, isDefault: false },
    });
  
    if (!violation) {
      throw new NotFoundException(`Violation not found or is default`);
    }
  
    await this.violationRepository.softDelete(id);
  }
  async softDeleteDefaultViolation(id: number) {
    const soft_delete = await this.violationRepository.softDelete(id);
    if (!soft_delete) {
      throw new NotFoundException(`Violation not found`);
    }
  }
  async getCoopVR(coop_id: number) {
    const violations = await this.violationRepository.find({
      where: {
        coop: { id: coop_id },
        deletedAt: IsNull(),
      },
    });

    const risks = await this.riskRepository.findAndCount({
      where: {
        coop: {
          id: coop_id
        }
      }
    });

    const message = !violations.length ? "No List of Violations" : null;

    return {
      violations,
      risks,
      message
    };
  }
  async getViolations() {
    const violations = await this.violationRepository.find({
      where: {
        isDefault: true,
      },
    });

    if (!violations.length) {
      throw new NotFoundException("No List of Default Violations");
    }
    return violations;
  }

  //Driver Risk Level
  async updateDriverRiskLevel(driver_id: number) {
    const previousViolations = await this.recordRepository.find({
      where: { driver: { id: driver_id } },
      relations: ['violation'],
    });
  
    const totalSeverity = previousViolations.reduce((acc, curr) => {
      return acc + (curr.violation.severity || 0);
    }, 0);
  
    const risks = await this.riskRepository.find({
      where: {
        coop: {
          driver_profile: {
            id: driver_id
          }
        },
      }
    });
    let level: string = 'none';

    for (const risk of risks) {
      if (totalSeverity >= risk.value) {
        level = risk.risk_level;
        break;
      }
    }
  
    const driverRisk = await this.driverRiskRepository.findOne({
      where: {
        driver_profile: {
          id: driver_id
        }
      },
    });

    if(driverRisk){
      driverRisk.risk_level = level;

      await this.driverRiskRepository.save(driverRisk);
    }
  }
  async resetDriverRiskLevel() {
    const allDrivers = await this.driverRiskRepository.find({});
    const updatedDrivers = allDrivers.map(driver => {
      if (driver.risk_level === 'high') {
        driver.risk_level = RiskLevel.MEDIUM;
      } else if (driver.risk_level === 'medium') {
        driver.risk_level = RiskLevel.LOW;
      } else if (driver.risk_level === 'low') {
        driver.risk_level = RiskLevel.NONE;
      }
      return driver;
    });
  
    await Promise.all(updatedDrivers.map(driver => this.driverRiskRepository.save(driver)));
  }  
  @Cron('0 0 30 4 *') // April 30
  async resetApril() {
    await this.resetDriverRiskLevel();
  }
  @Cron('0 0 31 8 *') // August 31
  async resetAugust() {
    await this.resetDriverRiskLevel();
  }
  @Cron('0 0 31 12 *') // December 31
  async resetDecember() {
    await this.resetDriverRiskLevel();
  }

  //Report
  async createReport(passenger_id: number, reportDto: ReportDto) {
    const { violation_id } = reportDto;

    const activeBoarding = await this.boardingRepository.findOne({
      where: { 
        request: {
          passenger: {
            id: passenger_id
          }
        },
        board_stat: BoardStat.ACTIVE
      },
      relations: ['driver', 'request', 'request.passenger'],
    });
    if (!activeBoarding) {
      throw new NotFoundException("Boarding details not found");
    }

    const violation = await this.violationRepository.findOne({
      where: { id: violation_id },
    });
    if (!violation) {
      throw new NotFoundException("Violation not found");
    }

    const report = this.reportRepository.create({
      boarding: activeBoarding,
      violation,
    });

    await this.reportRepository.save(report);

    const driver_id = activeBoarding.driver.id;
    const reports = await this.reportRepository.find({
      where: {
        boarding: {
          driver: {
            id: driver_id
          }
        },
        violation: { id: violation_id },
        coop_deletedAt: IsNull(), 
      },
    });

    const reportCount = reports.length;

    if (reportCount === 5) {
      const driver = activeBoarding.driver;
      const current_date = new Date();

      await this.recordRepository.save({
        driver,
        report_by: ReportBy.PASSENGERS,
        violation,
        created_at: new Date(),
      });

      const expiration_date = new Date(current_date);
      expiration_date.setDate(current_date.getDate() + 7);
      for (const rep of reports) {
        await this.reportRepository.update(
          { id: rep.id },
          { coop_deletedAt: new Date() }
        );
        await this.discountRepository.save({
          report: rep,
          expire_date: expiration_date,
          discount_amount: 0.50,
          discount_type: DiscountType.NOT_APP
        });
      }
    }

    await this.updateDriverRiskLevel(driver_id);
    return report;
  }
  async editReport(id: number, update_report: ReportDto) {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException("Driver Report not found");
    }

    if (update_report.violation_id) {
      const violation = await this.violationRepository.findOne({
        where: { id: update_report.violation_id },
      });
      if (!violation) {
        throw new NotFoundException("Violation not found");
      }
      report.violation = violation;
    }

    return await this.reportRepository.save(report);
  }
  async PassDeleteReports(id: number) {
    const soft_delete = await this.reportRepository.findOne({
      where: {
        id
      }
    });
    if (!soft_delete) {
      throw new NotFoundException(`Report not found`);
    }
    soft_delete.pass_deletedAt = new Date();
    await this.reportRepository.save(soft_delete);
  }
  async CoopDeleteReports(id: number) {
    const soft_delete = await this.reportRepository.findOne({
      where: {
        id
      }
    });
    if (!soft_delete) {
      throw new NotFoundException(`Report not found`);
    }
    soft_delete.coop_deletedAt = new Date();
    await this.reportRepository.save(soft_delete);
  }
  async getPassReports(passenger_id: number) {
    const reports = await this.reportRepository.find({
      where: {
        boarding: {
          request: {
            passenger: {
              id: passenger_id
            }
          }
        },
        pass_deletedAt: IsNull(),
      },
      order: { created_at: "DESC" },
      relations: ["violation", "boarding.driver"],
    });

    if (!reports.length) {
      throw new NotFoundException("No List of Reports");
    }
    return reports;
  }
  async getCoopReports(coop_id: number) {
    const reports = await this.reportRepository.find({
      where: {
        boarding: {
          driver: {
            coop: {
              id: coop_id
            }
          }
        },
        coop_deletedAt: IsNull(),
      },
      order: { created_at: "DESC" },
      relations: ["boarding.request.passenger", "violation", "boarding.driver"],
    });

    if (!reports.length) {
      throw new NotFoundException("No List of Reports");
    }
    return reports;
  }

  //Risk
  async createRisk(coop_id: number) {
    const activeCoop = await this.userRepository.findOne({
      where: {
        id: coop_id,
      },
    });
    if (!activeCoop) {
      throw new NotFoundException("Risk not found");
    }
  
    const highRisk = this.riskRepository.create({
      coop: activeCoop,
      risk_level: RiskLevel.HIGH,
      value: 50,
    });
    const mediumRisk = this.riskRepository.create({
      coop: activeCoop,
      risk_level: RiskLevel.MEDIUM,
      value: 30,
    });
    const lowRisk = this.riskRepository.create({
      coop: activeCoop,
      risk_level: RiskLevel.LOW,
      value: 10,
    });
  
    await Promise.all([
      this.riskRepository.save(highRisk),
      this.riskRepository.save(mediumRisk),
      this.riskRepository.save(lowRisk),
    ]);
  
    return [highRisk, mediumRisk, lowRisk];
  }
  async editRisk(id: number, updateRisk: UpdateRiskDto) {
    const risk = await this.riskRepository.findOne({ where: { id } });
    if (!risk) {
      throw new NotFoundException("Risk not found");
    }

    Object.assign(risk, updateRisk);
    return await this.riskRepository.save(risk);
  }
  async getRisk(coop_id:number) {
    const risks = await this.riskRepository.find({
      where: {
        coop: {
          id: coop_id
        }
      },
    });

    if (!risks.length) {
      throw new NotFoundException("No List of Risk");
    }
    return risks;
  }

  //Record
  async createRecord(recordDto: RecordDto) {
    const { driver_id, violation_id } = recordDto;
  
    const driver = await this.driverRepository.findOne({ where: { id: driver_id } });
    if (!driver) {
      throw new NotFoundException("Driver not found");
    }
  
    const violation = await this.violationRepository.findOne({ where: { id: violation_id } });
    if (!violation) {
      throw new NotFoundException("Violation not found");
    }
  
    const record = this.recordRepository.create({ 
      driver, 
      violation, 
      report_by:ReportBy.COOP
    });
    await this.recordRepository.save(record);
  
    await this.updateDriverRiskLevel(driver_id);
  
    return record;
  }
  async filterRecord(coop_id: number, filter: FilterRecordDto) {
    const { date } = filter;

    const query = this.recordRepository.createQueryBuilder("record")
    .leftJoinAndSelect("record.violation", "violation")
    .leftJoinAndSelect("record.driver", "driver")
    .leftJoinAndSelect("driver.coop", "coop") 
    .where("coop.id = :coop_id", { coop_id });

  if (date) {
    query.andWhere("DATE(record.created_at) = :date", { date });
  }

  query.orderBy("record.created_at", "ASC");

  const records = await query.getMany();

    if (!records.length) {
      throw new NotFoundException("No List of Drivers Violation");
    }
    return records;
  }
  async getRecords(coopId:number) {
    const records = await this.recordRepository.find({
      where: {
        driver: {
          coop: {
            id: coopId
          }
        }
      },
      relations: ["driver"],
    });

    if (!records.length) {
      throw new NotFoundException("No List of Drivers Violation");
    }
    return records;
  }

  //Fare
  async createFare(coop_id: number, fareDto: FareDto) {
    const { from_loc, from_lat, from_long, to_loc, to_lat, to_long, amount } = fareDto;
    const activeCoop = await this.userRepository.findOne({ 
      where: { 
        id: coop_id,
        role: UserRole.COOP
      } 
    });
    if (!activeCoop) {
      throw new NotFoundException("Coop not found");
    }

    const fare = this.fareRepository.create({
      coop: activeCoop,
      from_loc,
      from_lat,
      from_long,
      to_loc,
      to_lat,
      to_long,
      amount
    } as DeepPartial<Fare>);

    return await this.fareRepository.save(fare);
  }
  async editFare(id: number, updateFare: FareDto) {
    const fare = await this.fareRepository.findOne({ where: { id } });
    if (!fare) {
      throw new NotFoundException("Id not found");
    }

    Object.assign(fare, updateFare);
    return await this.fareRepository.save(fare);
  }
  async softDeleteFare(id: number) {
    const soft_delete = await this.fareRepository.softDelete(id);
    if (!soft_delete) {
      throw new NotFoundException(`Fare not found`);
    }
  }
  async getFares(coop_id: number) {
    const fares = await this.fareRepository.find({
      where: { deletedAt: IsNull(),
        coop: { id: coop_id },
    },
    });

    if (!fares.length) {
      throw new NotFoundException("No List of Fares");
    }
    return fares;
  }

  //Dashboard
  async dashboard(coop_id: number) {
    const current_date = new Date();
    const todays_record = await this.recordRepository.count({
      where: { 
        created_at: current_date,
        driver: {
          coop: {
            id: coop_id
          }
        } 
    },
    });
    const duty_driver = await this.driverStatusRepository.count({
      where: {
        status: Status.IN_TRANSIT,
        driver_profile: {
          coop: {
            id: coop_id
          }
        }
      }
    });
    const reports = await this.reportRepository.count({
      where: {
        created_at: current_date,
        boarding: {
          driver: {
            coop: {
              id: coop_id
            }
          }
        }
      }
    });

    return {
      data: {
        todays_record,
        duty_driver,
        reports
      }
    }
  }
}