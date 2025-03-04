import { CompanyContactResponse, ContactColorResponse, CompanyContactModalResponse } from 'appcoretruckassist';

export interface IContactsInitialData {
    data?: CompanyContactResponse[];
    contactColors?: ContactColorResponse[];
    contactLabels?: CompanyContactModalResponse;
    tableCount?: number;
    isShowMore?: boolean;
}