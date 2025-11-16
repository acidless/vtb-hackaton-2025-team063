import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Repository} from "typeorm";
import {RedisService} from "../redis/redis.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../common/events/cache-invalidate.event";

@Injectable()
export class FamilyService {
    private baseKey = "partner";

    public constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly redisService: RedisService) {
    }

    public async getFamilyMember(userId: number) {
        return this.usersRepository.findOne({where: {partner: {id: userId}}});
    }

    public async getFamilyMemberId(userId: number) {
        const partner = await this.redisService.withCache(`${this.baseKey}:${userId}`, 86400, async () => {
                return this.usersRepository.findOne({where: {partner: {id: userId}}});
            },
            response => Boolean(response)
        );

        if (!partner) {
            return;
        }

        await this.redisService.redis.set(
            `${this.baseKey}:${partner.id}`,
            userId.toString(),
            "EX",
            86400,
        );

        return partner.id;
    }


    @OnEvent('cache.invalidate.users', {async: true})
    async handleConsentsInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.redisService.invalidateCache(this.baseKey, userId);
    }
}
