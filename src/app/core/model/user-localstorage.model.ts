interface CompanyData {
    companyName: string;
    id: number;
    isActive: boolean;
    isDivision: boolean;
    lastLogin: string;
    logo: string;
}

export interface UserModel {
    companyUserId: any;
    areSettingsUpdated: boolean;
    avatar: string;
    companies: CompanyData[];
    driverId: number;
    firstName: string;
    lastName: string;
    refreshToken: string;
    token: string;
    userId: number;
}
