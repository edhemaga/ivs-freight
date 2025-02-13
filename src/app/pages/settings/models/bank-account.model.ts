import { EBankAccountStatus } from '@pages/settings/enums';

export class IBankAccount {
    id?: number;
    bankId: string;
    routing: string;
    account: string;
    status?: EBankAccountStatus;
}
