import { Pipe, PipeTransform } from '@angular/core';

// Interface
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Enum
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

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
        }
    }
}
