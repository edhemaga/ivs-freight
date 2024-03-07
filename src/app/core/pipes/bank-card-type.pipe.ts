import { Pipe, PipeTransform } from '@angular/core';

// enum
import { BankCardTypesEnum } from '../utils/enums/bank-card-types.enum';

@Pipe({
    name: 'bankCardTypesPipe',
    standalone: true,
})
export class BankCardTypesPipe implements PipeTransform {
    constructor() {}

    transform(cardType: string) {
        return BankCardTypesEnum[cardType];
    }
}
