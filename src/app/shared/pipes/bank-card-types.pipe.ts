import { Pipe, PipeTransform } from '@angular/core';

// enums
import { BankCardTypesStringEnum } from '@shared/enums/bank-card-types-string.enum';

@Pipe({
    name: 'bankCardTypesPipe',
    standalone: true,
})
export class BankCardTypesPipe implements PipeTransform {
    constructor() {}

    transform(cardType: string) {
        return BankCardTypesStringEnum[cardType];
    }
}
