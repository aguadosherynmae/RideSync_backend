import { Controller, Body, Post, Put, Param, Delete,Get, ParseIntPipe } from '@nestjs/common';
import { DriversService  } from './drivers.service';
import { FeedbackDto } from './dto/boarding.dto';
import { DriverStatusDto } from './dto/driver_status.dto';
import { IssueReportDto } from './dto/issue_report.dto';
import { UpdateDriverProfileDto } from './dto/driver_profile.dto';

@Controller("drivers")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}
  
  //Driver Profile
  @Put("editProfile/:id")
  async editDriverProfile(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProfile: UpdateDriverProfileDto
  ) {
    return this.driversService.editDriverProfile(id, updateProfile);
  }
  @Get("getProfile/:id")
  async getDriverProfile(@Param("id", ParseIntPipe) id: number) {
    return this.driversService.getDriverProfile(id);
  }

  //Feedback
  @Post("createFeedback/:id")
  async createFeedback(
    @Param("id", ParseIntPipe) id: number,
    @Body() feedbackDto: FeedbackDto
  ) {
    return this.driversService.createFeedback(id, feedbackDto);
  }
  @Put("editFeedback/:id")
  async editFeedback(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateFeedback: FeedbackDto
  ) {
    return this.driversService.editFeedback(id, updateFeedback);
  }
  @Delete("UserDeleteFeedback/:id")
  async UserDeleteFeedback(@Param("id", ParseIntPipe) id: number) {
    return this.driversService.UserDeleteFeedback(id);
  }
  @Get("getUserFeedback/:id")
  async getUserFeedback(@Param("id", ParseIntPipe) id: number) {
    return this.driversService.getUserFeedback(id);
  }
  @Get("CoopDeleteFeedback/:id")
  async CoopDeleteFeedback(@Param("id", ParseIntPipe) id: number) {
    return this.driversService.CoopDeleteFeedback(id);
  }
  @Get("allFeedbacks/:id")
  async getFeedbacks(@Param("id", ParseIntPipe) id: number) {
    return this.driversService.getFeedbacks(id);
  }

  //Driver Status
  @Put("editStatus/:id")
  async editDriverStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStatus: DriverStatusDto
  ) {
    return this.driversService.editDriverStatus(id, updateStatus);
  }
  @Get('getDriverStatus/:coop_id/:filter')
  async getDriverStatus(
    @Param('coop_id', ParseIntPipe) coop_id: number,
    @Param('filter') filter: string,
  ) {
    return await this.driversService.getDriverStatus(coop_id, filter);
  }

  //Bus Status
  @Put("issueReport/:id")
  async issueReport(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBus: IssueReportDto
  ) {
    return this.driversService.issueReport(id, updateBus);
  }
  @Put("issueFix/:id")
  async issueFix(
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.driversService.issueFix(id);
  }
}