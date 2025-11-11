import {Injectable, NotFoundException} from '@nestjs/common';
import {RedisService} from "../../../redis/redis.service";
import {FamilyService} from "../../../family/family.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Goal} from "./goal.entity";
import {In, Repository} from "typeorm";
import {AccountsService} from "../accounts.service";
import {GoalDTO} from "./goal.dto";

@Injectable()
export class GoalsService {
    private baseKey = "goals";

    public constructor(
        @InjectRepository(Goal)
        private readonly goalsRepository: Repository<Goal>,
        private readonly redisService: RedisService,
        private readonly accountsService: AccountsService,
        private readonly familyService: FamilyService) {
    }

    public async getGoals(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 3600, async () => {
            const goals = await this.goalsRepository.find({where: {user: {id: In([userId, memberId])}}});
            return await Promise.all(goals.map(async goal => {
                const balance = await this.accountsService.getBalance(goal.id, goal.bankId, userId);
                return {...goal, collected: balance};
            }));
        });
    }

    public async createGoal(userId: number, goalDTO: GoalDTO) {
        const account = await this.accountsService.createAccount(userId, goalDTO.bankId, {type: "savings"});

        const goal = this.goalsRepository.create({...goalDTO, user: {id: userId}, id: account.accountId});
        await this.goalsRepository.save(goal);

        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyService.getFamilyKey(userId, memberId);

        await this.redisService.invalidateCache(this.baseKey, familyKey);

        return {...goal, collected: 0};
    }

    public async deleteGoal(userId: number, goalId: string) {
        const goal = await this.goalsRepository.findOne({where: {user: {id: userId}, id: goalId}});
        if(!goal) {
            throw new NotFoundException("Финансовая цель не найдена");
        }

        const account = await this.accountsService.closeAccount(userId, goal.bankId, goalId, {action: "transfer"});
        if(account.status === "closed") {
            await this.goalsRepository.remove(goal);

            const memberId = await this.familyService.getFamilyMemberId(userId);
            const familyKey = this.familyService.getFamilyKey(userId, memberId);

            await this.redisService.invalidateCache(this.baseKey, familyKey);
        }
    }
}
