import {Module} from '@nestjs/common';
import {CodeService} from './code.service';
import {CodeController} from './code.controller';
import {RedisModule} from "../../redis/redis.module";

@Module({
    imports: [RedisModule],
    providers: [CodeService],
    exports: [CodeService],
    controllers: [CodeController]
})
export class CodeModule {
}
