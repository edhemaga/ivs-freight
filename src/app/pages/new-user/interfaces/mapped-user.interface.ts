import { AddressEntity, BankResponse } from "appcoretruckassist";

export interface IMappedUser {
    fullName: string;
    avatar: string | null;
    id: number;
    isSelected: boolean;
    department: string | null;
    email: string | null;
    companyOffice: string | null;
    phone: string | null;
    extensionPhone: string | null;
    personalPhone: string | null;
    personalEmail: string | null;
    address: AddressEntity | null;
    userStatus: string | null;
    lastLogin: string | null;
    bankName: string | null;
    routingNumber: string | null;
    accountNumber: string | null;
    payrollType: string | null;
    salary: number | null;
}
