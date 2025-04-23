import { Controller, Body, Post, Put, Param, Delete,Get, ParseIntPipe } from '@nestjs/common';
import { DriversService  } from './drivers.service';
import { FeedbackDto } from './dto/boarding.dto';

@Controller("drivers")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}
  
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
}