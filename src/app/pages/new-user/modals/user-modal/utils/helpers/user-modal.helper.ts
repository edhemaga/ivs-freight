// Form
import {
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
} from '@angular/forms';

// Models
import { Tabs } from '@ca-shared/models/tabs.model';

// Enums
import { eUserModalForm } from '@pages/new-user/modals/user-modal/enums';

// Validators
import {
    firstNameValidation,
    lastNameValidation,
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
            },
        ];
    }

    static getDepartmentTabs(): Tabs[] {
        return [
            {
                id: 1,
                name: 'User',
                checked: true,
            },
            {
                id: 2,
                name: 'Admin',
                checked: false,
            },
        ];
    }

    static createForm(): UntypedFormGroup {
        return new UntypedFormGroup({
            [eUserModalForm.EMAIL]: new UntypedFormControl('', [
                Validators.required,
                Validators.email,
            ]),
            [eUserModalForm.FIRST_NAME]: new UntypedFormControl('', [
                Validators.required,
                ...firstNameValidation,
            ]),
            [eUserModalForm.LAST_NAME]: new UntypedFormControl('', [
                Validators.required,
                ...lastNameValidation,
            ]),
        });
    }
}
