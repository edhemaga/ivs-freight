// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';

export class AccountHelper {
    static accountMapper(
        accountResponse: GetCompanyAccountListResponse
    ): IMappedAccount[] {
        return accountResponse.pagination.data.map((account) => {
            const { id, name } = account;

            const mapped: IMappedAccount = {
                id,
                name,
            };

            return mapped;
        });
    }
}
