// import { FormControl } from '@angular/forms';

// Models
import { CompanyAccountResponse } from 'appcoretruckassist';

// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';

export class AccountHelper {
    static accountsMapper(
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
                label: companyAccountLabel,
                createdAt,
                updatedAt,
                // formControl: new FormControl(),
            };

            return mapped;
        });
    }
}
