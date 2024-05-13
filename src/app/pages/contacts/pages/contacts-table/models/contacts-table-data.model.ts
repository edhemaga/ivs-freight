import {
    AddressEntity,
    CompanyContactLabelResponse,
    ContactColorResponse,
    ContactEmailResponse,
    ContactPhoneResponse,
} from 'appcoretruckassist';

export class ContactsTableData {
    id?: number;
    note?: string | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: AddressEntity;
    shared?: boolean;
    avatar?: string | null;
    companyContactLabel?: CompanyContactLabelResponse;
    colorRes?: ContactColorResponse;
    colorLabels?: CompanyContactLabelResponse[] | null;
    contactPhones?: ContactPhoneResponse[] | null;
    contactEmails?: ContactEmailResponse[] | null;
    createdAt?: string;
    updatedAt?: string;
    actionAnimation?: string;
}
