import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Repository} from "typeorm";
import {RedisService} from "../redis/redis.service";

@Injectable()
export class FamilyService {
    public constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly redisService: RedisService) {
    }

    public async getFamilyMember(userId: number) {
        return this.usersRepository.findOne({where: {partner: {id: userId}}});
    }

    public async getFamilyMemberId(userId: number) {
        const partner = await this.redisService.withCache(`partner:${userId}`, 86400, () => {
            return this.usersRepository.findOne({where: {partner: {id: userId}}});;
        })

        if(partner) {
            await this.redisService.redis.set(`partner:${partner.id}`, userId.toString(), "EX", 86400);
        }

        return partner?.id;
    }

    public getFamilyKey(userId: number, partnerId?: number) {
        return [userId, partnerId].filter(Boolean).sort().join(":");
    }
}
