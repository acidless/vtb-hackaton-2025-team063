import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Limit} from "./limit.entity";
import {LimitDTO} from "./limit.dto";
import {FamilyService} from "../../family/family.service";
import {RedisService} from "../../redis/redis.service";

@Injectable()
export class LimitsService {
    public constructor(
        @InjectRepository(Limit)
        private readonly limitRepository: Repository<Limit>,
        private readonly redisService: RedisService,
        private readonly familyService: FamilyService,
    ) {
    }

    public async create(userId: number, limitDTO: LimitDTO) {
        const limit = this.limitRepository.create({...limitDTO, user: {id: userId}});
        await this.limitRepository.save(limit);

        const partnerId = await this.familyService.getFamilyMemberId(userId);
        await this.redisService.redis.del(this.getCacheKey(userId, partnerId));

        return limit;
    }

    public async delete(userId: number, limitId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);

        const removed = await this.limitRepository.delete({id: limitId, user: {id: In([userId, partnerId])}});
        if (!removed.affected || removed.affected === 0) {
            throw new NotFoundException("Лимит для удаления не найден");
        }

        await this.redisService.redis.del(this.getCacheKey(userId, partnerId));
    }

    public async getAll(userId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const cacheKey = this.getCacheKey(userId, partnerId);

        return this.redisService.withCache(cacheKey, 3600, () => {
            return this.limitRepository.find({where: {user: {id: In([userId, partnerId])}}});
        });
    }

    private getCacheKey(userId: number, partnerId?: number) {
        const cacheKey = this.familyService.getFamilyKey(userId, partnerId);
        return `limits:${cacheKey}`;
    }
}
