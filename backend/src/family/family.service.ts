import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Repository} from "typeorm";
import Redis from "ioredis";

@Injectable()
export class FamilyService {
    public constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @Inject('REDIS_CLIENT') private readonly redis: Redis) {
    }

    public async getFamilyMember(userId: number) {
        return this.usersRepository.findOne({where: {partner: {id: userId}}});
    }

    public async getFamilyMemberId(userId: number) {
        const cachedId = await this.redis.get(`partner:${userId}`);
        if(cachedId) {
            return JSON.parse(cachedId);
        }

        const partner = await this.usersRepository.findOne({where: {partner: {id: userId}}});

        await this.redis.set(`partner:${userId}`, partner ? partner.id.toString() : "null", "EX", 86400);
        if(partner) {
            await this.redis.set(`partner:${partner.id}`, userId.toString(), "EX", 86400);
        }

        return partner?.id;
    }

    public getFamilyKey(userId: number, partnerId?: number) {
        return [userId, partnerId].filter(Boolean).sort();
    }
}
