import { Controller, Post, Body, Param, ParseIntPipe, Put, Delete, Get } from '@nestjs/common';
import { CoopService } from './coop.service';
import { ViolationDto } from './dto/violation.dto';
import { UpdateViolationDto } from './dto/update_violation.dto';

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
  @Get("coopViolations/:id")
  async getCoopViolations(@Param("id", ParseIntPipe) id: number) {
    return this.coopService.getCoopViolations(id);
  }
  @Get("getViolations")
  async getViolations() {
    return this.coopService.getViolations();
  }
}