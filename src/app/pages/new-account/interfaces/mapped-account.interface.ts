import { ICompanyAccountLabel } from './company-account-label.interface';

export interface IMappedAccount {
    id?: number;
    name: string;
    isSelected: boolean;
    username?: string;
    password?: string;

    companyAccountLabel?: ICompanyAccountLabel;
    url?: string;
    note?: string;
    companyAccountLabelId?: number;
    createdAt?: string;
    updatedAt?: string;
}
