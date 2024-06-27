import { FileResponse } from "appcoretruckassist";

export interface User {
    companyUserId: any;
    areSettingsUpdated: boolean;
    avatarFile: FileResponse;
    companies: CompanyData[];
    driverId: number;
    firstName: string;
    lastName: string;
    refreshToken: string;
    token: string;
    userId: number;
}

interface CompanyData {
    companyName: string;
    id: number;
    isActive: boolean;
    isDivision: boolean;
    lastLogin: string;
    logo: string;
}
