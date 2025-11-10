import {Injectable, NotFoundException} from '@nestjs/common';
import {FamilyService} from "../family/family.service";
import {RedisService} from "../redis/redis.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "./payment.entity";
import {In, Repository} from "typeorm";
import {PaymentDTO} from "./payment.dto";

@Injectable()
export class PaymentsService {
    public constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly familyService: FamilyService,
        private readonly redisService: RedisService) {
    }

    public async getAll(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        return this.redisService.withCache(`payments:${this.familyService.getFamilyKey(userId, memberId)}`, 3600, async () => {
            return this.paymentRepository.find({where: {user: {id: In([userId, memberId])}}});
        });
    }

    public async create(userId: number, paymentDTO: PaymentDTO) {
        const newPayment = this.paymentRepository.create({...paymentDTO, user: {id: userId}});
        await this.paymentRepository.save(newPayment);

        const memberId = await this.familyService.getFamilyMemberId(userId);
        await this.redisService.redis.del(`payments:${this.familyService.getFamilyKey(userId, memberId)}`);

        return newPayment;
    }

    public async delete(userId: number, paymentId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);

        const result = await this.paymentRepository.delete({id: paymentId, user: {id: In([userId, paymentId])}});
        if (!result.affected || result.affected === 0) {
            throw new NotFoundException("Платеж не найден");
        }

        await this.redisService.redis.del(`payments:${this.familyService.getFamilyKey(userId, memberId)}`);
    }
}
