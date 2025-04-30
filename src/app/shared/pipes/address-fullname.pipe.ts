import { Pipe, PipeTransform } from '@angular/core';
import { eStringPlaceholder } from '@shared/enums';
import { AddressEntity } from 'appcoretruckassist';

@Pipe({
    name: 'addressFullname',
    standalone: true,
})
export class AddressFullnamePipe implements PipeTransform {
    transform(address: AddressEntity) {
        if (!address) return eStringPlaceholder.EMPTY;

        const fullAddress =
            (address.streetNumber
                ? address.streetNumber + eStringPlaceholder.WHITESPACE
                : eStringPlaceholder.EMPTY) +
            (address.street ?? eStringPlaceholder.EMPTY) +
            (address.city
                ? eStringPlaceholder.COMMA_WHITESPACE + address.city
                : eStringPlaceholder.EMPTY) +
            (address.stateShortName
                ? eStringPlaceholder.COMMA_WHITESPACE + address.stateShortName
                : eStringPlaceholder.EMPTY) +
            (address.zipCode
                ? eStringPlaceholder.WHITESPACE + address.zipCode
                : eStringPlaceholder.EMPTY);

        return fullAddress;
    }
}
