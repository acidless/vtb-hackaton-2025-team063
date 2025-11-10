import {Module} from '@nestjs/common';
import {FamilyService} from './family.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {CodeModule} from './code/code.module';
import {FamilyController} from './family.controller';
import {UsersModule} from "../users/users.module";
import {RedisModule} from "../redis/redis.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), UsersModule, CodeModule, RedisModule],
    providers: [FamilyService],
    exports: [FamilyService],
    controllers: [FamilyController],
})
export class FamilyModule {
}
