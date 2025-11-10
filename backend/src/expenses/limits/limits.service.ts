import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Limit} from "./limit.entity";
import Redis from "ioredis";
import {LimitDTO} from "./limit.dto";
import {FamilyService} from "../../family/family.service";

@Injectable()
export class LimitsService {
    public constructor(
        @InjectRepository(Limit)
        private readonly limitRepository: Repository<Limit>,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        private readonly familyService: FamilyService,
    ) {
    }

    public async create(userId: number, limitDTO: LimitDTO) {
        const limit = this.limitRepository.create({...limitDTO, user: {id: userId}});
        await this.limitRepository.save(limit);

        const partnerId = await this.familyService.getFamilyMemberId(userId);
        await this.redis.del(this.getCacheKey(userId, partnerId));

        return limit;
    }

    public async delete(userId: number, limitId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);

        const limit = await this.limitRepository.findOne({where: {id: limitId, user: {id: In([userId, partnerId])}}});
        if(!limit) {
            throw new NotFoundException("Лимит для удаления не найден");
        }

        await this.limitRepository.remove(limit);

        await this.redis.del(this.getCacheKey(userId, partnerId));
    }

    public async getAll(userId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const cacheKey = this.getCacheKey(userId, partnerId);

        const cached = await this.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const limits = await this.limitRepository.find({where: {user: {id: In([userId, partnerId])}}});

        await this.redis.setex(cacheKey, 3600, JSON.stringify(limits));

        return limits;
    }

    private getCacheKey(userId: number, partnerId?: number) {
        const cacheKey = this.familyService.getFamilyKey(userId, partnerId);
        return `limits:${cacheKey}`;
    }
}
