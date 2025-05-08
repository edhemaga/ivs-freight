// Models
import { CompanyAccountResponse } from 'appcoretruckassist';

// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';

export class AccountHelper {
    static accountsMapper(
        accounts: CompanyAccountResponse[]
    ): IMappedAccount[] {
        return accounts.map((account) => {
            const { id, name } = account;

            const mapped: IMappedAccount = {
                id,
                name,
                isSelected: false,
            };

            return mapped;
        });
    }
}
