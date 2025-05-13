import { Pipe, PipeTransform } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

// Enum
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

// Interface
import { ICaInput } from 'ca-components';

@Pipe({
    name: 'userModalInputConfig',
    standalone: true,
})
export class UserModalInputConfigPipe implements PipeTransform {
    transform({ configType }: { configType: string }): ICaInput {
        switch (configType) {
            case eUserModalForm.EMAIL:
                return {
                    name: 'Email',
                    type: 'text',
                    label: 'Email',
                    placeholderIcon: 'email',
                    minLength: 5,
                    maxLength: 64,
                    textTransform: 'lowercase',
                    autoFocus: true,
                };

            case eUserModalForm.FIRST_NAME:
                return {
                    name: 'First name',
                    type: 'text',
                    label: 'First Name',
                    minLength: 2,
                    maxLength: 26,
                    textTransform: 'capitalize',
                };

            case eUserModalForm.LAST_NAME:
                return {
                    name: 'Last name',
                    type: 'text',
                    label: 'Last Name',
                    minLength: 2,
                    maxLength: 26,
                    textTransform: 'capitalize',
                };

            case eUserModalForm.DEPARTMENT:
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Department',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-318',
                };

            case eUserModalForm.OFFICE:
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Office',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-252',
                };

            case eUserModalForm.PHONE:
                return {
                    name: 'Phone',
                    type: 'text',
                    label: 'Phone',
                    placeholderIcon: 'phone',
                    mask: '(000) 000-0000',
                    maxLength: 14,
                };

            case eUserModalForm.PHONE_EXTENSION:
                return {
                    name: 'Phone',
                    type: 'text',
                    label: 'Ext.',
                    minLength: 1,
                    maxLength: 8,
                    placeholderIcon: 'phone-extension',
                };

            case eUserModalForm.PERSONAL_PHONE:
                return {
                    name: 'Personal Phone',
                    type: 'text',
                    label: 'Personal Phone',
                    placeholderIcon: 'phone',
                    mask: '(000) 000-0000',
                    maxLength: 14,
                };

            case eUserModalForm.PERSONAL_EMAIL:
                return {
                    name: 'Personal Email',
                    type: 'text',
                    label: 'Personal Email',
                    placeholderIcon: 'email',
                };

            case eUserModalForm.ADDRESS:
                return {
                    name: 'Address',
                    type: 'text',
                    label: 'Address, City, State Zip',
                    placeholderIcon: 'address',
                    textTransform: 'capitalize',
                    dropdownWidthClass: 'w-col-376',
                    minLength: 6,
                    maxLength: 256,
                };

            case eUserModalForm.ADDRESS_UNIT:
                return {
                    name: 'address-unit',
                    type: 'text',
                    label: 'Unit #',
                    textTransform: 'uppercase',
                    minLength: 1,
                    maxLength: 10,
                };
            case eUserModalForm.START_DATE: {
                return {
                    name: 'datepicker',
                    label: 'Start Date',
                    type: 'text',
                    isDropdown: true,
                    placeholderIcon: 'date',
                    customClass: 'datetimeclass',
                };
            }

            case eUserModalForm.SALARY: {
                return {
                    name: 'Salary',
                    type: 'text',
                    label: 'Salary',
                    placeholderIcon: 'dollar',
                    thousandSeparator: true,
                    minLength: 4,
                    maxLength: 8,
                };
            }

            case eUserModalForm.BANK_NAME: {
                return {
                    name: 'Input Dropdown Bank Name',
                    type: 'text',
                    label: 'Bank Name',
                    minLength: 2,
                    maxLength: 64,
                    textTransform: 'uppercase',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-164',
                    dropdownImageInput: {
                        withText: true,
                        svg: false,
                        image: true,
                        template: 'user',
                        iconsPath: '',
                        activeItemIconKey: 'logoName',
                    },
                };
            }
            case eUserModalForm.ROUTING: {
                return {
                    name: 'routing-bank',
                    type: 'text',
                    label: 'Routing #',
                    minLength: 9,
                    maxLength: 9,
                };
            }

            case eUserModalForm.ACCOUNT: {
                return {
                    name: 'account-bank',
                    type: 'text',
                    label: 'Account',
                    placeholderIcon: 'password',
                    minLength: 5,
                    maxLength: 17,
                };
            }

            case eUserModalForm.PAYMENT_TYPE: {
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Payment Type',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-177',
                };
            }
        }
    }
}
