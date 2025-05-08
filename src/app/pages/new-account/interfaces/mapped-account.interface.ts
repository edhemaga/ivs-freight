import { ICompanyAccountLabel } from './company-account-label.interface';

export interface IMappedAccount {
    id?: number;
    name: string;
    isSelected: boolean;
    username?: string;
    password?: string;
    label?: ICompanyAccountLabel;
    url?: string;
    companyAccountLabelId?: number;
}
