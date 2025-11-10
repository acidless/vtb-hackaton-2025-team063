import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";

@Injectable()
export class RedisService {
    public constructor(
        @Inject('REDIS_CLIENT') public readonly redis: Redis
    ) {
    }

    public async withCache<T>(key: string, ttl: number, callback: () => Promise<T>, useCache = () => true) {
        if(useCache()){
            const data = await this.redis.get(key);
            if (data) {
                return JSON.parse(data) as T;
            }
        }

        const response = await callback();
        if(useCache()) {
            await this.redis.set(key, JSON.stringify(response), "EX", ttl);
        }

        return response;
    }
}
