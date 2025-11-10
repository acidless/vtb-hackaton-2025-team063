import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';
import {DataSource, EntityManager, Repository} from 'typeorm';
import {UserCreateDTO, UserEditDTO, UserLoginDTO} from "./user.dto";
import {AccountsService} from "../banks/accounts/accounts.service";
import {TransactionsService} from "../banks/accounts/transactions/transactions.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly dataSource: DataSource,
        private readonly accountsService: AccountsService,
        private readonly transactionsService: TransactionsService
    ) {
    }

    public async createUser(user: UserCreateDTO): Promise<User> {
        const foundUser = await this.usersRepository.findOne({where: {phone: user.phone}});
        if (foundUser) {
            throw new BadRequestException("Пользователь с таким номером телефона уже существует");
        }

        return this.dataSource.transaction(async (manager: EntityManager) => {
            const newUser = manager.create(User, {...user, partner: user.partner ? {id: user.partner} : undefined});
            await manager.save(newUser);

            if (user.partner) {
                await manager.update(User, {id: user.partner}, {partner: {id: newUser.id}});
            }

            return newUser;
        });
    }

    public async findUser(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({where: {id: userId}});
        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }

    public async getUserByPhone(userLoginDTO: UserLoginDTO): Promise<User> {
        const user = await this.usersRepository.findOne({where: {phone: userLoginDTO.phone}});
        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }

    public async editUser(userId: number, userEditDTO: UserEditDTO) {
        if (!userEditDTO) {
            throw new BadRequestException("Укажите значения для изменения");
        }

        await this.usersRepository.update({id: userId}, {...userEditDTO});

        return this.usersRepository.findOne({where: {id: userId}});
    }

    public async getUserExtendedInfo(userId: number) {
        const accounts = await this.accountsService.getAccounts(userId);

        const account = Object.values(accounts).flat(1)[0];
        const accountDigits = account ? account.account[0].identification.slice(-4) : null;

        const balance = Math.round(await this.accountsService.getTotalBalance(userId));

        let monthlyIncome = 0;
        const transactions = await this.transactionsService.getTransactions(userId);
        for (const transaction of Object.values(transactions).flat(1)) {
            if (transaction.creditDebitIndicator === "Credit" && transaction.status === "completed") {
                monthlyIncome += parseFloat(transaction.amount.amount);
            }
        }

        monthlyIncome = Math.round(monthlyIncome);

        return {account: accountDigits, balance, monthlyIncome};
    }
}
