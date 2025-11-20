import {Module} from '@nestjs/common';
import {CardsService} from './cards.service';
import {BanksModule} from "../banks.module";
import {RedisModule} from "../../redis/redis.module";

@Module({
    imports: [BanksModule, RedisModule],
    providers: [CardsService]
})
export class CardsModule {
}
