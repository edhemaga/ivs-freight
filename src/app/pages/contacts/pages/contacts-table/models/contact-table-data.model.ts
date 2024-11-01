import {
    AddressEntity,
    CompanyAccountLabelResponse,
    ContactColorResponse,
    UpdateContactEmailCommand,
    UpdateContactPhoneCommand,
} from 'appcoretruckassist';
import { ContactLabelData } from '@pages/contacts/pages/contacts-table/models/contact-label-data.model';
import { TableDropdownContent } from '@shared/models/card-models/card-table-data.model';

export class ContactTableData {
    id: number;
    name: string;
    isSelected: boolean;
    note: string;
    lable?: ContactLabelData;
    textAddress?: string;
    textShared?: string;
    textShortName?: string;
    updatedAt?: string;
    shared?: boolean;
    phone?: string;
    isShared: boolean;
    email: string;
    createdAt?: string;
    avatar?: string;
    avatarImg?: string;
    avatarColor?: { background?: string; color: string };
    address?: AddressEntity;
    contactPhones?: UpdateContactPhoneCommand[] | null;
    contactEmails?: UpdateContactEmailCommand[] | null;
    tableDropdownContent?: TableDropdownContent;
    companyContactLabelId?: CompanyAccountLabelResponse | null;
    colorLabels?: CompanyAccountLabelResponse[];
    colorRes?: ContactColorResponse;
}
