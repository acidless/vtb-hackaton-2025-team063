import {Module} from '@nestjs/common';
import {FamilyService} from './family.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {CodeModule} from './code/code.module';
import {FamilyController} from './family.controller';
import {UsersModule} from "../users/users.module";
import {RedisModule} from "../redis/redis.module";
import {FamilyCacheService} from "./family-cache.service";

@Module({
    imports: [TypeOrmModule.forFeature([User]), UsersModule, CodeModule, RedisModule],
    providers: [FamilyService, FamilyCacheService],
    exports: [FamilyService, FamilyCacheService],
    controllers: [FamilyController],
})
export class FamilyModule {
}
