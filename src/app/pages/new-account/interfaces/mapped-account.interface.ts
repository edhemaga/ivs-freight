// import { FormControl } from '@angular/forms';
import { ICompanyAccountLabel } from './company-account-label.interface';

export interface IMappedAccount {
    id: number;
    name: string | null;
    isSelected: boolean;
    url: string | null;
    username: string | null;
    password: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    companyAccountLabel?: ICompanyAccountLabel;
    note?: string;
    companyAccountLabelId?: number;
    // formControl: FormControl;
}
