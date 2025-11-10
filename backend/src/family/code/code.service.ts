import {Injectable} from '@nestjs/common';
import {RedisService} from "../../redis/redis.service";

@Injectable()
export class CodeService {
    public constructor(private readonly redisService: RedisService) {
    }

    public async makeCode(userId: number) {
        const exitstingCode = await this.redisService.redis.get(`family:code:${userId}`);
        if (exitstingCode) {
            return exitstingCode;
        }

        const code = this.generateCode();
        await this.redisService.redis.set(`family:code:${code}`, userId.toString(), "EX", 86400);
        await this.redisService.redis.set(`family:code:${userId}`, code, "EX", 86400);

        return code;
    }

    public async getCodeExpiration(userId: number) {
        const ttl = await this.redisService.redis.ttl(`family:code:${userId}`);
        if (ttl < 0) {
            return null;
        }

        return new Date(Date.now() + ttl * 1000);
    }

    public async getUserFromCode(code: string) {
        const userId = await this.redisService.redis.get(`family:code:${code}`);
        if(userId) {
            return Number(userId);
        }

        return null;
    }

    private generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
