// Form
import {
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
} from '@angular/forms';

// Models
import { Tabs } from '@ca-shared/models/tabs.model';
import { CompanyUserResponse } from 'appcoretruckassist';

// Enums
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

// Validators
import {
    addressUnitValidation,
    addressValidation,
    firstNameValidation,
    lastNameValidation,
    phoneExtension,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

export class UserModalHelper {
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

    static generateModalTitle(isEdit: boolean): string {
        return isEdit ? 'Edit User' : 'Invite User';
    }

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
                userData?.isAdmin
            ),
            [eUserModalForm.OFFICE]: new UntypedFormControl(
                userData?.companyOffice?.id
            ),
            [eUserModalForm.PHONE]: new UntypedFormControl(userData?.phone, [
                phoneFaxRegex,
            ]),
            [eUserModalForm.PHONE_EXTENSION]: new UntypedFormControl(
                userData?.extensionPhone,
                [...phoneExtension]
            ),
            [eUserModalForm.PERSONAL_EMAIL]: new UntypedFormControl(
                userData?.personalEmail,
                [Validators.email]
            ),
            [eUserModalForm.PERSONAL_PHONE]: new UntypedFormControl(
                userData?.personalPhone,
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
        });
    }
}
