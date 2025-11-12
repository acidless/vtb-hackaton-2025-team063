import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Limit} from "./limit.entity";
import {LimitDTO} from "./limit.dto";
import {RedisService} from "../../redis/redis.service";
import {FamilyCacheService} from "../../family/family-cache.service";
import {FamilyService} from "../../family/family.service";

@Injectable()
export class LimitsService {
    private keyBase = "limits";

    public constructor(
        @InjectRepository(Limit)
        private readonly limitRepository: Repository<Limit>,
        private readonly redisService: RedisService,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
    ) {
    }

    public async create(userId: number, limitDTO: LimitDTO) {
        const limit = this.limitRepository.create({...limitDTO, user: {id: userId}});
        await this.limitRepository.save(limit);

        await this.familyCacheService.invalidateFamilyCache(this.keyBase, userId);

        return {...limit, spent: 0};
    }

    public async delete(userId: number, limitId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);

        const removed = await this.limitRepository.delete({id: limitId, user: {id: In([userId, partnerId])}});
        if (!removed.affected || removed.affected === 0) {
            throw new NotFoundException("Лимит для удаления не найден");
        }

        await this.familyCacheService.invalidateFamilyCache(this.keyBase, userId);
    }

    public async getAll(userId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, partnerId);

        return this.redisService.withCache(`${this.keyBase}:${familyKey}`, 3600, async () => {
            const limits = await this.limitRepository.find({where: {user: {id: In([userId, partnerId])}}});
            return limits.map(limit => ({...limit, spent: 0}));
        });
    }
}
