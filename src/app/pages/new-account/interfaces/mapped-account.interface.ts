import { CompanyAccountLabelResponse } from 'appcoretruckassist/model/models';

export interface IMappedAccount {
    id: number;
    name: string | null;
    isSelected: boolean;
    url: string | null;
    username: string | null;
    password: string | null;
    label: CompanyAccountLabelResponse;
    createdAt: string | null;
    updatedAt: string | null;
}
