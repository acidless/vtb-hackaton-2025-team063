import {Module} from '@nestjs/common';
import {FamilyService} from './family.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [FamilyService],
    exports: [FamilyService],
})
export class FamilyModule {
}
