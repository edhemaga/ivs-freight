export interface CompanyAccountResponse { 
    id?: number;
    name?: string | null;
    url?: string | null;
    username?: string | null;
    password?: string | null;
    api?: number;
    apiCategory?: any;
    note?: string | null;
    companyAccountLabel?: CompanyAccountLabelResponse;
}


export interface CompanyAccountLabelResponse { 
    id?: number;
    name?: string | null;
    color?: string | null;
}
