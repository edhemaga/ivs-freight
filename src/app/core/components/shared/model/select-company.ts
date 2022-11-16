export interface SelectCompany {
    companyId: number;
    companyLogo: any;
    companyName: string;
    companyUserId: number;
    createdAt: string;
    updatedAt: string;
}

export interface SelectCompanyResponse {
    newTokenFlag: number;
    token: string;
}
