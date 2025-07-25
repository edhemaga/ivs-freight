// Form
import {
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
    ValidatorFn,
    AbstractControl,
} from '@angular/forms';

// Models
import { Tabs } from '@ca-shared/models/tabs.model';
import { CompanyUserResponse } from 'appcoretruckassist';

// Enums
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

// Validators
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    firstNameValidation,
    lastNameValidation,
    phoneExtension,
    phoneFaxRegex,
    routingBankValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// bootstrap
import { Options } from '@angular-slider/ngx-slider';

export class UserModalHelper {
    static createForm(userData: CompanyUserResponse): UntypedFormGroup {
        return new UntypedFormGroup({
            [eUserModalForm.EMAIL]: new UntypedFormControl(userData?.email, [
                Validators.required,
                Validators.email,
            ]),
            [eUserModalForm.FIRST_NAME]: new UntypedFormControl(
                userData?.firstName,
                [Validators.required, ...firstNameValidation]
            ),
            [eUserModalForm.LAST_NAME]: new UntypedFormControl(
                userData?.lastName,
                [Validators.required, ...lastNameValidation]
            ),
            [eUserModalForm.DEPARTMENT]: new UntypedFormControl(
                userData?.department?.id,
                [Validators.required]
            ),
            [eUserModalForm.IS_ADMIN]: new UntypedFormControl(
                userData?.isAdmin ?? false
            ),
            [eUserModalForm.OFFICE]: new UntypedFormControl(
                userData?.companyOffice?.id
            ),
            [eUserModalForm.PHONE]: new UntypedFormControl(userData?.phone, [
                phoneFaxRegex,
            ]),
            [eUserModalForm.PHONE_EXTENSION]: new UntypedFormControl(
                userData?.extensionPhone ?? null,
                [...phoneExtension]
            ),
            [eUserModalForm.PERSONAL_EMAIL]: new UntypedFormControl(
                userData?.personalEmail ?? null
                // [Validators.email]
            ),
            [eUserModalForm.PERSONAL_PHONE]: new UntypedFormControl(
                userData?.personalPhone ?? null,
                [phoneFaxRegex]
            ),
            [eUserModalForm.ADDRESS]: new UntypedFormControl(
                userData?.address,
                [...addressValidation]
            ),
            [eUserModalForm.ADDRESS_UNIT]: new UntypedFormControl(
                userData?.address?.addressUnit,
                [...addressUnitValidation]
            ),
            [eUserModalForm.NOTE]: new UntypedFormControl(userData?.note),
            [eUserModalForm.START_DATE]: new UntypedFormControl(
                userData?.startDate ?? null
            ),
            [eUserModalForm.SALARY]: new UntypedFormControl({
                value: userData?.salary ?? userData?.base,
                disabled: true,
            }),
            [eUserModalForm.IS_1099]: new UntypedFormControl(userData?.is1099),
            [eUserModalForm.INCLUDED_IN_PAYROLL]: new UntypedFormControl(
                userData?.includeInPayroll ?? false,
                [this.requiredIfIncludedInPayroll()]
            ),
            [eUserModalForm.BANK_NAME]: new UntypedFormControl(
                userData?.bank?.id,
                [...bankValidation]
            ),
            [eUserModalForm.ROUTING]: new UntypedFormControl(
                {
                    value: userData?.routingNumber,
                    disabled: !userData?.routingNumber,
                },
                [...routingBankValidation]
            ),
            [eUserModalForm.ACCOUNT]: new UntypedFormControl(
                {
                    value: userData?.accountNumber,
                    disabled: !userData?.accountNumber,
                },
                [...accountBankValidation]
            ),
            [eUserModalForm.PAYMENT_TYPE]: new UntypedFormControl({
                value: userData?.paymentType?.id ?? null,
                disabled: true,
            }),
            [eUserModalForm.COMMISSION]: new UntypedFormControl(
                userData?.commission ?? null
                // disabled: true,
            ),
        });
    }

    static generateModalTitle(isEdit: boolean): string {
        return isEdit ? 'Edit User' : 'Invite User';
    }

    static getDepartmentTabs(isAdmin: boolean): Tabs[] {
        return [
            {
                id: 1,
                name: 'User',
                checked: !isAdmin,
            },
            {
                id: 2,
                name: 'Admin',
                checked: isAdmin,
            },
        ];
    }

    static getTaxFormTabs(is1099: boolean): Tabs[] {
        return [
            {
                id: 1,
                name: '1099',
                checked: is1099,
            },
            {
                id: 2,
                name: 'W-2',
                checked: !is1099,
            },
        ];
    }

    static getUserTabs(): Tabs[] {
        return [
            {
                id: 1,
                name: 'Basic',
                checked: true,
            },
            {
                id: 2,
                name: 'Additional',
                checked: false,
                disabled: true,
            },
        ];
    }

    static getCommissionOptions(): Options {
        return {
            floor: 2.5,
            ceil: 25,
            step: 0.5,
            showSelectionBar: true,
            hideLimitLabels: true,
        };
    }

    static updateValidators(
        formControl: UntypedFormControl,
        validators: ValidatorFn[] | null
    ) {
        formControl.setValidators(validators);
        formControl.updateValueAndValidity();
    }

    static removeValidators(
        formControl: UntypedFormControl,
        validators: ValidatorFn[] | null
    ) {
        formControl.removeValidators(validators);
        formControl.updateValueAndValidity();
    }

    static requiredIfIncludedInPayroll(): ValidatorFn {
        return (control: AbstractControl) => {
            if (!control.parent) return null;

            if (control.value) {
                UserModalHelper.updateValidators(
                    control.parent.get(
                        eUserModalForm.START_DATE
                    ) as UntypedFormControl,
                    [Validators.required]
                );
                UserModalHelper.updateValidators(
                    control.parent.get(
                        eUserModalForm.SALARY
                    ) as UntypedFormControl,
                    [Validators.required]
                );
            } else {
                UserModalHelper.removeValidators(
                    control.parent.get(
                        eUserModalForm.START_DATE
                    ) as UntypedFormControl,
                    [Validators.required]
                );
                UserModalHelper.removeValidators(
                    control.parent.get(
                        eUserModalForm.SALARY
                    ) as UntypedFormControl,
                    [Validators.required]
                );
            }

            return null;
        };
    }
}
