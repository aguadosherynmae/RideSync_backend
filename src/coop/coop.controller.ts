import { Controller, Post, Body, Param, ParseIntPipe, Put, Delete, Get } from '@nestjs/common';
import { CoopService } from './coop.service';
import { ViolationDto } from './dto/violation.dto';
import { UpdateViolationDto } from './dto/update_violation.dto';
import { ReportDto } from './dto/report.dto';
import { RiskDto } from './dto/risk.dto';
import { RecordDto } from './dto/record.dto';
import { FareDto } from './dto/fare.dto';
import { FilterRecordDto } from './dto/filter_record.dto';

@Controller("coop")
export class CoopController {
  constructor(private readonly coopService: CoopService) {}

  //Violation
  @Post("createViolation/:id")
  async createViolation(
    @Param("id", ParseIntPipe) id: number,
    @Body() violationDto: ViolationDto
  ) {
    return this.coopService.createViolation(id, violationDto);
  }
  @Post("createDefaultViolation")
  async createDefaultViolation(@Body() violationDto: ViolationDto) {
    return this.coopService.createDefaultViolation(violationDto);
  }
  @Put("editViolation/:id")
  async editViolation(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateViolation: UpdateViolationDto
  ) {
    return this.coopService.editViolation(id, updateViolation);
  }
  @Put("editDefaultViolation/:id")
  async editDefaultViolation(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateViolation: UpdateViolationDto
  ) {
    return this.coopService.editDefaultViolation(id, updateViolation);
  }
  @Delete("deleteViolations/:id")
  async softDeleteViolation(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.softDeleteViolation(id);
  }
  @Delete("deleteDefaultViolations/:id")
  async softDeleteDefaultViolation(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.softDeleteDefaultViolation(id);
  }
  @Get("getCoopVR/:id")
  async getCoopVR(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.getCoopVR(id);
  }
  @Get("getViolations")
  async getViolations() {
    return this.coopService.getViolations();
  }

  //Report
  @Post("createReport/:id")
  async createReport(
    @Param("id", ParseIntPipe) id: number,
    @Body() reportDto: ReportDto
  ) {
    return this.coopService.createReport(id, reportDto);
  }
  @Put("editReport/:id")
  async editReport(
    @Param("id", ParseIntPipe) id: number,
    @Body() update_report: ReportDto
  ) {
    return this.coopService.editReport(id, update_report);
  }
  @Delete("deleteReport/:id")
  async PassDeleteReports(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.PassDeleteReports(id);
  }
  @Delete("CoopdeleteReport/:id")
  async CoopDeleteReports(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.CoopDeleteReports(id);
  }
  @Get("getPassReports/:id")
  async getPassReports(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.getPassReports(id);
  }
  @Get("getCoopReports/:id")
  async getCoopReports(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.getCoopReports(id);
  }

  //Risk
  @Put("editRisk/:id")
  async editRisk(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRisk: RiskDto
  ) {
    return this.coopService.editRisk(id, updateRisk);
  }

  //Record
  @Post("createRecord")
  async createRecord(@Body() recordDto: RecordDto) {
    return this.coopService.createRecord(recordDto);
  }
  @Get("getRecord/:id/:date")
  async getRecord(
    @Param("id", ParseIntPipe) id: number,
    @Param("date") date: string,
    ) {
    const filter: FilterRecordDto = { date: new Date(date) };
    return this.coopService.getRecord(id, filter);
  }

  //Fare
  @Post("createFare/:id")
  async createFare(
    @Param("id", ParseIntPipe) id: number,
    @Body() fareDto: FareDto
  ) {
    return this.coopService.createFare(id, fareDto);
  }
  @Put("editFare/:id")
  async editFare(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateFare: FareDto
  ) {
    return this.coopService.editFare(id, updateFare);
  }
  @Delete("deleteFare/:id")
  async softDeleteFare(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.softDeleteFare(id);
  }
  @Get("coopFares/:id")
  async getFares(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.getFares(id);
  }

  //Dashboard
  @Get("dashboard/:id")
  async dashboard(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.dashboard(id);
  }
}