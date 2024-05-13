import {
    AccountColorResponse,
    CompanyAccountLabelResponse,
    CompanyAccountResponse,
} from 'appcoretruckassist';

export interface AccountResponse extends CompanyAccountResponse {
    actionAnimation?: string;
    colorLabels?: CompanyAccountLabelResponse[];
    colorRes?: AccountColorResponse;
}
