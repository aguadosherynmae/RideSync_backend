import { Controller, Post, Body, Put, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { DevService } from './dev.service';
import { HelpDto } from './dto/help.dto';
import { SubscriptionDto } from './dto/subscription.dto';

@Controller('dev')
export class DevController {
    constructor(private readonly devService: DevService) {}

    //Help
    @Post("createHelp")
    async createHelp(@Body() helpDto: HelpDto) {
        return this.devService.createHelp(helpDto);
    }
    @Put("editHelp/:id")
    async editHelp(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateDto: HelpDto
    ) {
        return this.devService.editHelp(id, updateDto);
    }
    @Delete("deleteHelp/:id")
    async deleteHelp(@Param("id", ParseIntPipe) id: number) {
        return this.devService.deleteHelp(id);
    }
    @Get("getHelp")
    async getHelp() {
        return this.devService.getHelp();
    }

    //Subscription
    @Put("renew/:id")
    async renew(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateSub: SubscriptionDto
    ) {
        return this.devService.renew(id, updateSub);
    }
    @Get("getcoopSub/:id")
    async getcoopSub(@Param("id", ParseIntPipe) id: number) {
        return this.devService.getcoopSub(id);
    }
    @Get("getSubscriptions")
    async getSubscriptions() {
        return this.devService.getSubscriptions();
    }
}
