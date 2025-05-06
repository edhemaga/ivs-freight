// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';

// Models
import { CompanyAccountResponse } from 'appcoretruckassist';

export class AccountHelper {
    static accountsMapper(
        accounts: CompanyAccountResponse[]
    ): IMappedAccount[] {
        return accounts.map((account) => {
            const { id, name } = account;

            const mapped: IMappedAccount = {
                id,
                name,
            };

            return mapped;
        });
    }
}
