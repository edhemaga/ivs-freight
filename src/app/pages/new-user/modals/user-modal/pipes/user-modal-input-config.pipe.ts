import { Pipe, PipeTransform } from '@angular/core';

// Enum
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

// Interface
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

@Pipe({
    name: 'userModalInputConfig',
    standalone: true,
})
export class UserModalInputConfigPipe implements PipeTransform {
    transform({ configType }): ITaInput {
        switch (configType) {
            case eUserModalForm.EMAIL:
                return {
                    name: 'Email',
                    type: 'text',
                    label: 'Email',
                    placeholderIcon: 'email',
                    isRequired: true,
                    minLength: 5,
                    maxLength: 64,
                    textTransform: 'lowercase',
                };

            case eUserModalForm.FIRST_NAME:
                return {
                    name: 'First name',
                    type: 'text',
                    label: 'First Name',
                    isRequired: true,
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
                    isRequired: true,
                    textTransform: 'capitalize',
                };

            case eUserModalForm.DEPARTMENT:
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Department',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-318',
                    isRequired: true,
                };

            case eUserModalForm.OFFICE:
                return {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Office',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-252',
                    isRequired: true,
                };

            case eUserModalForm.PHONE:
                return {
                    name: 'Phone',
                    type: 'text',
                    label: 'Phone',
                    placeholderIcon: 'phone',
                };

            case eUserModalForm.PHONE_EXTENSION:
                return {
                    name: 'Phone',
                    type: 'text',
                    label: 'Ext.',
                    placeholderIcon: 'phoneExt',
                };

            case eUserModalForm.PERSONAL_PHONE:
                return {
                    name: 'Personal Phone',
                    type: 'text',
                    label: 'Personal Phone',
                    placeholderIcon: 'phone',
                };

            case eUserModalForm.PERSONAL_EMAIL:
                return {
                    name: 'Personal Email',
                    type: 'text',
                    label: 'Personal Email',
                    placeholderIcon: 'email',
                };

            case eUserModalForm.START_DATE: {
                return {
                    name: 'datepicker',
                    label: 'Start Date',
                    type: 'text',
                    isDropdown: true,
                    placeholderIcon: 'date',
                    isRequired: true,
                    customClass: 'datetimeclass',
                };
            }

            case eUserModalForm.SALARY: {
                return {
                    name: 'Salary',
                    type: 'text',
                    label: 'Salary',
                    isRequired: true,
                    placeholderIcon: 'dollar',
                    thousandSeparator: true,
                    minLength: 4,
                    maxLength: 8,
                };
            }
        }
    }
}
