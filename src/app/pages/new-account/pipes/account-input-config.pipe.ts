import { Pipe, PipeTransform } from '@angular/core';

// Components
import { ICaInput } from 'ca-components';

// Enums
import { eGeneralActions } from '@shared/enums';
import { eAccountInputConfigKeys } from '../enums';

@Pipe({
    name: 'accountInputConfig',
    standalone: true,
})
export class AccountInputConfigPipe implements PipeTransform {
    transform(
        configKey: eAccountInputConfigKeys,
        isEdit?: boolean
    ): ICaInput | null {
        switch (configKey) {
            case eAccountInputConfigKeys.NAME: {
                const isEditMode = isEdit;
                return {
                    name: 'Account Name',
                    type: 'text',
                    label: 'Account Name',
                    isRequired: true,
                    maxLength: 64,
                    minLength: 2,
                    textTransform: 'capitalize',
                    autoFocus: !isEditMode,
                };
            }

            case eAccountInputConfigKeys.COMPANY_LABEL:
                return {
                    name: 'Input Dropdown Label',
                    type: 'text',
                    label: 'Label',
                    placeholderIcon: 'ic_dynamic_label',
                    dropdownLabel: true,
                    dropdownWidthClass: 'w-col-456',
                    textTransform: 'lowercase',
                    blackInput: true,
                    minLength: 1,
                    maxLength: 32,
                    commands: {
                        active: false,
                        type: 'confirm-cancel',
                        firstCommand: {
                            popup: {
                                name: 'Confirm',
                                backgroundColor: '#3074d3',
                            },
                            name: 'confirm',
                            svg: 'assets/svg/ic_spec-confirm.svg',
                        },
                        secondCommand: {
                            popup: {
                                name: 'Cancel',
                                backgroundColor: '#2f2f2f',
                            },
                            name: eGeneralActions.CANCEL,
                            svg: 'assets/svg/ic_x.svg',
                        },
                    },
                };

            case eAccountInputConfigKeys.USERNAME:
                return {
                    name: 'Username',
                    type: 'text',
                    label: 'Username',
                    placeholderIcon: 'user_icon',
                    isRequired: true,
                    minLength: 2,
                    maxLength: 30,
                };

            case eAccountInputConfigKeys.PASSWORD:
                return {
                    name: 'Password',
                    type: 'password',
                    label: 'Password',
                    placeholderIcon: 'password',
                    isRequired: true,
                    maxLength: 64,
                };

            case eAccountInputConfigKeys.URL:
                return {
                    name: 'Url',
                    type: 'text',
                    label: 'URL',
                    placeholderIcon: 'ic_web',
                    minLength: 4,
                    maxLength: 255,
                };

            default:
                return null;
        }
    }
}
