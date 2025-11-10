import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class FamilyService {
    public constructor(@InjectRepository(User)
                       private usersRepository: Repository<User>) {
    }

    public async getFamilyMember(userId: number) {
        return this.usersRepository.findOne({where: {partner: {id: userId}}});
    }
}
