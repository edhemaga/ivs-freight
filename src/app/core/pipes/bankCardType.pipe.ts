import { Pipe, PipeTransform } from '@angular/core';

const BankCardTypes = {
    VISA: 'visa',
    AMERICAN: 'amex',
    MASTERCARD: 'mastercard',
    DISCOVER: 'discover',
};

@Pipe({
    name: 'bankCardTypesPipe',
    standalone: true,
})
export class BankCardTypesPipe implements PipeTransform {
    constructor() {}

    transform(cardType: string) {
        return BankCardTypes[cardType];
    }
}
