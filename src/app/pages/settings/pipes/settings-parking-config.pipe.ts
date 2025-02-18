import { Pipe, PipeTransform } from '@angular/core';

// Models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

@Pipe({
    name: 'settingsParkingConfig',
    standalone: true,
})
export class SettingsParkingConfigPipe implements PipeTransform {
    transform(type: string, value?: boolean): ITaInput {
        switch (type) {
            case 'name':
                return {
                    name: 'Parking Name',
                    type: 'text',
                    label: 'Parking Name',
                    isRequired: true,
                    autoFocus: value,
                    textTransform: 'uppercase',
                    minLength: 1,
                    maxLength: 64,
                };
            case 'phone':
                return {
                    name: 'Phone',
                    type: 'text',
                    label: 'Phone',
                    placeholderIcon: 'phone',
                    isRequired: false,
                    mask: '(000) 000-0000',
                    maxLength: 14,
                };
            case 'phoneExt':
                return {
                    name: 'phone-extension',
                    type: 'text',
                    label: 'Ext.',
                    minLength: 1,
                    maxLength: 8,
                    placeholderIcon: 'phone-extension',
                };
            case 'email':
                return {
                    name: 'Email',
                    type: 'text',
                    label: 'Email',
                    placeholderIcon: 'email',
                    minLength: 5,
                    maxLength: 64,
                    textTransform: 'lowercase',
                };
            case 'address':
                return {
                    name: 'Address',
                    type: 'text',
                    label: 'Address, City, State Zip',
                    isRequired: true,
                    placeholderIcon: 'address',
                    textTransform: 'capitalize',
                    dropdownWidthClass: 'w-col-376',
                    minLength: 6,
                    maxLength: 256,
                };
            case 'addressUnit':
                return {
                    name: 'address-unit',
                    type: 'text',
                    label: 'Unit #',
                    textTransform: 'uppercase',
                    minLength: 1,
                    maxLength: 10,
                };
            case 'payPeriod':
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Pay Period',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-148',
                };
            case 'monthlyDay':
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Day',
                    isDropdown: true,
                    isDisabled: !value,
                    dropdownWidthClass: 'w-col-148',
                };
            case 'rent':
                return {
                    name: 'Rent',
                    type: 'text',
                    label: 'Rent',
                    placeholderIcon: 'dollar',
                    thousandSeparator: true,
                    minLength: 4,
                    maxLength: 8,
                };
            case 'parkingSlot':
                return {
                    name: 'Parking Slot',
                    type: 'text',
                    label: 'Parking Slot # (Truck)',
                    minLength: 1,
                    maxLength: 64,
                };
            case 'fullParkingSlot':
                return {
                    name: 'Full Parking Slot',
                    type: 'text',
                    label: 'Full Parking Slot # (Semi Truck - Trailer)',
                    minLength: 1,
                    maxLength: 128,
                };
            default:
                return null;
        }
    }
}
