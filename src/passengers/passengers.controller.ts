import { Controller, Post, Body, Put, Param, ParseIntPipe, Get , Delete} from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { RequesDto } from './dto/request_ride.dto';
import { BoardingDto } from './dto/boarding_details';
import { PassengerProfileDto } from './dto/passenger_profile.dto';
import { UpdateProfileDto } from './dto/update_profile.dto';
import { filter } from 'rxjs';
import { PassengerViolationDto } from './dto/passenger_violation.dto';
import { UpdatePassengerViolationDto } from './dto/update_passenger_violation.dto';

@Controller("passengers")
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  //Request Ride
  @Post("createRequest/:id")
  async createRequest(
    @Param("id", ParseIntPipe) id: number,
    @Body() requestDto: RequesDto
  ) {
    return this.passengersService.createRequest(id, requestDto);
  }
  @Put("editRequest/:id")
  async editRequest(
    @Param("id", ParseIntPipe) id: number,
    @Body() requestDto: RequesDto
  ) {
    return this.passengersService.editRequest(id, requestDto);
  }
  @Get("userRequest/:id")
  async getUserRequest(@Param("id", ParseIntPipe) id: number) {
    return this.passengersService.getUserRequest(id);
  }

  //Boarding Details
  @Post("createPassengerBoarding/:id")
  async createPassengerBoarding(
    @Param("id", ParseIntPipe) id: number,
    @Body() boardDto: BoardingDto
  ) {
    return this.passengersService.createPassengerBoarding(id, boardDto);
  }
  @Post("createDriverBoarding/:id")
  async createDriverBoarding(@Param("id", ParseIntPipe) id: number) {
    return this.passengersService.createDriverBoarding(id);
  }
  @Delete("deleteDriverBoarding")
  async deleteDriverBoarding() {
    return this.passengersService.deleteDriverBoarding();
  }
  @Get("UserBoarding/:id")
  async getUserBoarding(@Param("id", ParseIntPipe) id: number) {
    return this.passengersService.getUserBoarding(id);
  }
  /*@Get("allActive/:id")
  async getActiveBoarding(
    @Param("id", ParseIntPipe) id: number,) {
    return this.passengersService.getActiveBoarding(id);
  } */

  //Passenger Profile
  @Post("createProfile/:id")
  async createPassengerProfile(
    @Param("id", ParseIntPipe) id: number,
    @Body() profileDto: PassengerProfileDto
  ) {
    return this.passengersService.createPassengerProfile(id, profileDto);
  }
  @Put("editProfile/:id")
  async editPassengerProfile(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: PassengerProfileDto
  ) {
    return this.passengersService.editPassengerProfile(id, updateData);
  }
  @Put("verifyProfile/:id")
  async verifyProfile(
    @Param("id", ParseIntPipe) id: number,
    @Body() verify: UpdateProfileDto
  ) {
    return this.passengersService.verifyProfile(id, verify);
  }
  @Get("profile/:id")
  async getPassengerProfile(@Param("id", ParseIntPipe) id: number) {
    return this.passengersService.getPassengerProfile(id);
  }
  @Get("getPassengers/:filter")
  async getPassengers(@Param("filter") filter: string) {
    return this.passengersService.getPassengers(filter);
  }
  @Get("getTotalPassengers")
  async getTotalPassengers() {
    return this.passengersService.getTotalPassengers();
  }

  //Passenger Violation
  @Post("createPassengerViolation/:id")
  async createPassengerViolation(
    @Param("id", ParseIntPipe) id: number,
    @Body() passenger_violationDto: PassengerViolationDto
  ) {
    return this.passengersService.createPassengerViolation(id, passenger_violationDto);
  }
  @Put("editPassV/:id")
  async editPassengerViolation(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePassV: UpdatePassengerViolationDto
  ) {
    return this.passengersService.editPassengerViolation(id, updatePassV);
  }
  @Delete("PassDeleteFeedback/:id")
  async PassDeleteFeedback(@Param("id", ParseIntPipe) id: number) {
    return this.passengersService.PassDeleteFeedback(id);
  }
  @Delete("DevDeleteFeedback/:id")
  async DevDeleteFeedback(@Param("id", ParseIntPipe) id: number) {
    return this.passengersService.DevDeleteFeedback(id);
  }
  @Get("passengerViolation/:id")
  async getPassengerViolations(@Param("id", ParseIntPipe) id: number) {
    return this.passengersService.getPassengerViolations(id);
  }
}