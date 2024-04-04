import { Pipe, PipeTransform } from '@angular/core';

// enums
import { BankCardTypesEnum } from '../../core/utils/enums/bank-card-types.enum';

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
