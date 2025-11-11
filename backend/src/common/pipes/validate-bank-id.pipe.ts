import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import {BanksConfig} from "../../banks/banks.config";

@Injectable()
export class ValidateBankIdPipe implements PipeTransform {
    async transform(value: string) {
        if (!BanksConfig[value]) {
            throw new NotFoundException('Неизвестный банк');
        }

        return value;
    }
}
