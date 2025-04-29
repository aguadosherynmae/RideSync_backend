import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Help } from './entities/help.entity';
import { HelpDto } from './dto/help.dto';
import { SubscriptionDto } from './dto/subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionStat, User } from 'src/auth/entities/user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(Help)
    private helpRepository: Repository<Help>,

    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    //Subscription
    async renew(id: number, updateSub: SubscriptionDto) {
      const subscription = await this.subscriptionRepository.findOne({
        where: { id },
        relations: ['coop'],
      });
      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
      const date = new Date();
    
      const coop = subscription.coop;
      if (!coop) {
        throw new NotFoundException('Associated coop not found');
      }
    
      if (coop.subscription_status === SubscriptionStat.EXPIRED) {
        const expiredDate = new Date(date);
        expiredDate.setMonth(date.getMonth() + updateSub.duration);
        subscription.created_at = date;
        subscription.expired_at = expiredDate.toISOString();
        Object.assign(subscription, updateSub);
        coop.subscription_status = SubscriptionStat.SUBSCRIBED;
      } else {
        const currentExpiredDate = new Date(subscription.expired_at);
        currentExpiredDate.setMonth(currentExpiredDate.getMonth() + updateSub.duration);
        subscription.expired_at = currentExpiredDate.toISOString();
        Object.assign(subscription, updateSub);
        coop.subscription_status = SubscriptionStat.SUBSCRIBED;
      }
    
      await this.userRepository.save(coop);
      return await this.subscriptionRepository.save(subscription);
    }
    @Cron('0 0 * * *') // Run daily at midnight
    async checkSub() {
      const subscriptions = await this.subscriptionRepository.find({
        where: {
          coop: {
            subscription_status: SubscriptionStat.SUBSCRIBED,
          },
        },
        relations: ['coop'],
      });

      const today = new Date();
      const todayDateStr = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

      for (const subscription of subscriptions) {
        const expiredDateStr = new Date(subscription.expired_at).toISOString().split('T')[0];
        const coop = subscription.coop;

        if (expiredDateStr === todayDateStr && coop) {
          coop.subscription_status = SubscriptionStat.EXPIRED;
          await this.userRepository.save(coop);
        }
      }
    }
    async getcoopSub(coop_id: number) {
      const subscription = await this.subscriptionRepository.find({
        where: {
          coop: {
            id: coop_id
          }
        }
      });
  
      if (!subscription.length) {
        throw new NotFoundException(`No Subscription found`);
      }
  
      return subscription;
    }
    async getSubscriptions() {
      const subscriptions = await this.subscriptionRepository.find({});
  
      if (!subscriptions.length) {
        throw new NotFoundException(`No Subscription found`);
      }
  
      return subscriptions;
    }
}