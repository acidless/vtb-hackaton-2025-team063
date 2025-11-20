import { Module, Global } from '@nestjs/common';
import { BanksQueueService } from './banks-queue.service';

@Global()
@Module({
    providers: [BanksQueueService],
    exports: [BanksQueueService],
})
export class BanksQueueModule {}