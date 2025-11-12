import {Injectable, NotFoundException} from '@nestjs/common';
import {FamilyService} from "../family/family.service";
import {RedisService} from "../redis/redis.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "./payment.entity";
import {In, Repository} from "typeorm";
import {PaymentDTO} from "./payment.dto";
import {FamilyCacheService} from "../family/family-cache.service";

@Injectable()
export class PaymentsService {
    private keyBase = "payments";

    public constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
        private readonly redisService: RedisService,
        ) {
    }

    public async getAll(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.keyBase}:${familyKey}`, 3600, async () => {
            return this.paymentRepository.find({where: {user: {id: In([userId, memberId])}}});
        });
    }

    public async create(userId: number, paymentDTO: PaymentDTO) {
        const newPayment = this.paymentRepository.create({...paymentDTO, user: {id: userId}});
        await this.paymentRepository.save(newPayment);

        await this.familyCacheService.invalidateFamilyCache(this.keyBase, userId);

        return newPayment;
    }

    public async delete(userId: number, paymentId: number) {
        const result = await this.paymentRepository.delete({id: paymentId, user: {id: In([userId, paymentId])}});
        if (!result.affected || result.affected === 0) {
            throw new NotFoundException("Платеж не найден");
        }

        await this.familyCacheService.invalidateFamilyCache(this.keyBase, userId);
    }
}
