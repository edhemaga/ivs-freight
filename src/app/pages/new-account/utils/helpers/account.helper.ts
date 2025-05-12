// import { FormControl } from '@angular/forms';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

// Validations
import {
    labelValidation,
    passwordAccountValidation,
    urlValidation,
    usernameValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// Models
import { CompanyAccountResponse } from 'appcoretruckassist';

// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';

// Enums
import { eFormControlName } from '@shared/enums';

export class AccountHelper {
    public static accountsMapper(
        accounts: CompanyAccountResponse[]
    ): IMappedAccount[] {
        return accounts.map((account) => {
            const {
                id,
                name,
                url,
                username,
                password,
                companyAccountLabel,
                createdAt,
                updatedAt,
            } = account;

            const mapped: IMappedAccount = {
                id,
                name,
                isSelected: false,
                url,
                username,
                password,
                companyAccountLabel,
                createdAt,
                updatedAt,
                // formControl: new FormControl(),
            };

            return mapped;
        });
    }

    public static createAccountModalForm(): UntypedFormGroup {
        const formBuilder: FormBuilder = new FormBuilder();
        return formBuilder.group({
            [eFormControlName.NAME]: [
                null,
                [Validators.required, ...labelValidation],
            ],
            [eFormControlName.USERNAME]: [
                null,
                [Validators.required, ...usernameValidation],
            ],
            [eFormControlName.PASSWORD]: [
                null,
                [Validators.required, ...passwordAccountValidation],
            ],
            [eFormControlName.URL]: [null, urlValidation],
            [eFormControlName.COMPANY_ACCOUNT_LABEL_ID]: [null],
            [eFormControlName.NOTE]: [null],
        });
    }

    public static patchAccountModalForm(
        form: UntypedFormGroup,
        data: IMappedAccount
    ): UntypedFormGroup {
        form.patchValue({
            [eFormControlName.NAME]: data?.name ?? [null],
            [eFormControlName.USERNAME]: data?.username ?? [null],
            [eFormControlName.PASSWORD]: data?.password ?? [null],
            [eFormControlName.URL]: data?.url ?? [null],
            [eFormControlName.COMPANY_ACCOUNT_LABEL_ID]:
                (data?.companyAccountLabelId ??
                    data?.companyAccountLabel?.name) || [null],
            [eFormControlName.NOTE]: data?.note,
        });
        return form;
    }
}
