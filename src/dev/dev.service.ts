import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Help } from './entities/help.entity';
import { HelpDto } from './dto/help.dto';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(Help)
    private helpRepository: Repository<Help>,
) {}

    //Help
    async createHelp(helpDto: HelpDto) {
        const { title, description, video_url } = helpDto;

        const help = this.helpRepository.create({
        title,
        description,
        video_url
        });

        return await this.helpRepository.save(help);
    }
    async editHelp(id: number, updateHelp: HelpDto) {
        const help = await this.helpRepository.findOne({ where: { id } });
        if (!help) {
        throw new NotFoundException("Help not found");
        }

        Object.assign(help, updateHelp);
        return await this.helpRepository.save(help);
    }
    async deleteHelp(id: number) {
        const help = await this.helpRepository.delete(id);
      
        if (help.affected === 0) {
          throw new NotFoundException(`Violation not found`);
        }
    }
    async getHelp() {
        const help = await this.helpRepository.find({});
    
        if (!help.length) {
          throw new NotFoundException("No List of Help");
        }
        return help;
    }     
}